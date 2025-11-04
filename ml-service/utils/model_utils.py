"""
Model utilities for loading and using the trained water quality model.
"""

import joblib
import numpy as np
import os
from typing import Dict, Tuple, Any


class WaterQualityModel:
    """Class for managing water quality prediction model"""
    
    def __init__(self, model_dir='models/trained'):
        """
        Initialize the water quality model
        
        Args:
            model_dir (str): Directory containing trained model files
        """
        self.model_dir = model_dir
        self.model = None
        self.scaler = None
        self.metadata = None
        self.label_mapping = None
        self.feature_names = None
        
    def load_model(self):
        """Load the trained model, scaler, and metadata"""
        try:
            # Load model
            model_path = os.path.join(self.model_dir, 'water_quality_rf_model.pkl')
            self.model = joblib.load(model_path)
            
            # Load scaler
            scaler_path = os.path.join(self.model_dir, 'scaler.pkl')
            self.scaler = joblib.load(scaler_path)
            
            # Load metadata
            metadata_path = os.path.join(self.model_dir, 'model_metadata.pkl')
            self.metadata = joblib.load(metadata_path)
            
            # Extract important info
            self.label_mapping = self.metadata['label_mapping']
            self.feature_names = self.metadata['feature_names']
            
            print(f"✅ Model loaded successfully!")
            print(f"   Model type: {self.metadata['model_type']}")
            print(f"   Accuracy: {self.metadata['accuracy']*100:.2f}%")
            print(f"   Training date: {self.metadata['training_date']}")
            
            return True
            
        except FileNotFoundError as e:
            print(f"❌ Error: Model files not found in {self.model_dir}")
            print(f"   Please run the training notebook first to generate model files.")
            return False
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            return False
    
    def predict(self, ph: float, temperature: float, turbidity: float, 
                dissolved_oxygen: float) -> Dict[str, Any]:
        """
        Predict water quality based on input parameters
        
        Args:
            ph: pH level
            temperature: Temperature in Celsius
            turbidity: Turbidity in NTU
            dissolved_oxygen: Dissolved oxygen in mg/L
            
        Returns:
            dict: Prediction results with description
        """
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        # Prepare input respecting the trained feature order from metadata
        input_features_by_name = {
            'ph': float(ph),
            'temperature': float(temperature),
            'turbidity': float(turbidity),
            'dissolved_oxygen': float(dissolved_oxygen),
        }

        # Some notebooks/datasets might use alternate keys; map if present in metadata
        alias_map = {
            'pH': 'ph',
            'temp': 'temperature',
            'do': 'dissolved_oxygen',
            'd_o': 'dissolved_oxygen',
        }

        ordered_values = []
        feature_names = self.feature_names or ['ph', 'temperature', 'turbidity', 'dissolved_oxygen']
        for name in feature_names:
            key = alias_map.get(name, name)
            if key not in input_features_by_name:
                raise ValueError(f"Missing required feature '{name}' for prediction input")
            ordered_values.append(input_features_by_name[key])

        input_data = np.array([ordered_values])

        # Scale input (scaler was fitted using the same feature order as metadata)
        input_scaled = self.scaler.transform(input_data)
        
        # Predict
        prediction = self.model.predict(input_scaled)[0]
        prediction_proba = self.model.predict_proba(input_scaled)[0]
        
        # Get quality class
        quality_class = self.label_mapping[prediction]
        confidence = prediction_proba[prediction]
        
        # Generate description
        description_result = self._generate_description(
            quality_class, ph, temperature, turbidity, dissolved_oxygen
        )
        
        # Add prediction info
        description_result['prediction_numeric'] = int(prediction)
        description_result['confidence'] = float(confidence)
        description_result['probabilities'] = {
            self.label_mapping[i]: float(prob) 
            for i, prob in enumerate(prediction_proba)
        }
        description_result['timestamp'] = None  # Will be set by API
        
        return description_result
    
    def _generate_description(self, quality_class: str, ph: float, 
                            temperature: float, turbidity: float, 
                            dissolved_oxygen: float) -> Dict[str, Any]:
        """
        Generate detailed description about fish condition based on water quality
        
        Args:
            quality_class: Predicted water quality class
            ph, temperature, turbidity, dissolved_oxygen: Water parameters
            
        Returns:
            dict: Description and recommendations
        """
        # Ideal ranges for Tilapia (Ikan Nila)
        IDEAL_PH_MIN, IDEAL_PH_MAX = 6.5, 8.5
        IDEAL_TEMP_MIN, IDEAL_TEMP_MAX = 25, 30
        IDEAL_TURBIDITY_MAX = 25  # NTU
        IDEAL_DO_MIN = 5.0  # mg/L
        
        # Initialize description components
        issues = []
        recommendations = []
        
        # Check pH
        if ph < 6.0:
            issues.append("pH terlalu rendah (asam)")
            recommendations.append("Tambahkan kapur pertanian untuk menaikkan pH")
        elif ph > 9.0:
            issues.append("pH terlalu tinggi (basa)")
            recommendations.append("Lakukan pergantian air secara bertahap")
        elif ph < IDEAL_PH_MIN or ph > IDEAL_PH_MAX:
            issues.append("pH di luar rentang optimal")
            recommendations.append("Monitor pH secara rutin dan lakukan penyesuaian bertahap")
        
        # Check Temperature
        if temperature < 20:
            issues.append("suhu terlalu rendah")
            recommendations.append("Pertimbangkan penggunaan pemanas air atau greenhouse")
        elif temperature > 32:
            issues.append("suhu terlalu tinggi")
            recommendations.append("Tingkatkan aerasi dan pertimbangkan peneduh kolam")
        elif temperature < IDEAL_TEMP_MIN or temperature > IDEAL_TEMP_MAX:
            issues.append("suhu di luar rentang optimal")
            recommendations.append("Monitor suhu dan sesuaikan dengan kondisi lingkungan")
        
        # Check Turbidity
        if turbidity > 50:
            issues.append("kekeruhan sangat tinggi")
            recommendations.append("Kurangi pemberian pakan dan tingkatkan filtrasi air")
        elif turbidity > IDEAL_TURBIDITY_MAX:
            issues.append("kekeruhan cukup tinggi")
            recommendations.append("Lakukan penggantian air parsial dan periksa sistem filtrasi")
        
        # Check Dissolved Oxygen
        if dissolved_oxygen < 3.0:
            issues.append("oksigen terlarut sangat rendah (berbahaya)")
            recommendations.append("SEGERA tingkatkan aerasi dan kurangi kepadatan ikan")
        elif dissolved_oxygen < IDEAL_DO_MIN:
            issues.append("oksigen terlarut di bawah ideal")
            recommendations.append("Tingkatkan aerasi dengan aerator atau kincir air")
        
        # Generate description based on quality class
        if quality_class == 'Baik':
            description = (
                f"Kualitas air dalam kondisi OPTIMAL untuk budidaya ikan nila. "
                f"Parameter pH ({ph:.2f}), suhu ({temperature:.1f}°C), kekeruhan ({turbidity:.1f} NTU), "
                f"dan oksigen terlarut ({dissolved_oxygen:.2f} mg/L) berada dalam rentang ideal. "
                f"Ikan nila dapat tumbuh dengan sehat, memiliki nafsu makan yang baik, dan sistem imun yang kuat. "
                f"Pertumbuhan ikan optimal dengan tingkat stres minimal."
            )
            if not recommendations:
                recommendations.extend([
                    "Pertahankan kualitas air saat ini",
                    "Lakukan monitoring rutin setiap hari",
                    "Berikan pakan berkualitas sesuai jadwal"
                ])
        
        elif quality_class == 'Normal':
            description = (
                f"Kualitas air dalam kondisi CUKUP BAIK untuk budidaya ikan nila. "
                f"Terdapat beberapa parameter yang perlu diperhatikan: {', '.join(issues) if issues else 'parameter masih dalam batas toleransi'}. "
                f"Ikan nila masih dapat bertahan dan tumbuh, namun mungkin mengalami sedikit stres. "
                f"Nafsu makan ikan bisa menurun dan pertumbuhan tidak seoptimal kondisi ideal. "
                f"Sistem kekebalan tubuh ikan mulai menurun, sehingga lebih rentan terhadap penyakit."
            )
            if not recommendations:
                recommendations.extend([
                    "Monitor parameter air lebih sering (2-3x sehari)",
                    "Siapkan rencana perbaikan kualitas air",
                    "Kurangi pemberian pakan jika ikan terlihat lemas"
                ])
        
        else:  # Perlu Perhatian
            description = (
                f"Kualitas air dalam kondisi BURUK dan MEMERLUKAN TINDAKAN SEGERA! "
                f"Masalah yang terdeteksi: {', '.join(issues)}. "
                f"Dalam kondisi air seperti ini, ikan nila mengalami STRES BERAT dan kesehatan mereka terancam. "
                f"Ikan akan menunjukkan gejala: nafsu makan menurun drastis atau tidak mau makan, "
                f"bergerak lemah di permukaan air (gasping), warna tubuh memucat, "
                f"sangat rentan terhadap penyakit dan infeksi, pertumbuhan terhenti, "
                f"dan dapat menyebabkan KEMATIAN MASSAL jika tidak segera ditangani."
            )
            if not recommendations:
                recommendations.extend([
                    "SEGERA lakukan pergantian air 30-50%",
                    "Hentikan pemberian pakan sementara",
                    "Tingkatkan aerasi secara maksimal"
                ])
            recommendations.append("Konsultasi dengan ahli budidaya ikan jika kondisi tidak membaik")
        
        return {
            'quality': quality_class,
            'description': description,
            'issues': issues if issues else ['Tidak ada masalah signifikan'],
            'recommendations': recommendations,
            'parameters': {
                'ph': ph,
                'temperature': temperature,
                'turbidity': turbidity,
                'dissolved_oxygen': dissolved_oxygen
            }
        }
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model"""
        if self.metadata is None:
            return {"error": "Model not loaded"}
        
        return {
            'model_type': self.metadata['model_type'],
            'features': self.metadata['feature_names'],
            'classes': list(self.metadata['label_mapping'].values()),
            'accuracy': self.metadata['accuracy'],
            'precision': self.metadata['precision'],
            'recall': self.metadata['recall'],
            'f1_score': self.metadata['f1_score'],
            'training_date': self.metadata['training_date'],
            'feature_importance': self.metadata['feature_importance']
        }


# Global model instance (singleton)
_model_instance = None

def get_model_instance() -> WaterQualityModel:
    """Get or create the global model instance"""
    global _model_instance
    if _model_instance is None:
        _model_instance = WaterQualityModel()
        _model_instance.load_model()
    return _model_instance






