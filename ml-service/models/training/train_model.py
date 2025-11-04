"""
Model Training Script

TODO: Implement actual model training
This is a template for training the water quality prediction model
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
# from sklearn.neural_network import MLPClassifier
import joblib
from datetime import datetime
import os

def load_data(csv_path='data/samples/Water_Quality_Dataset.csv'):
    """
    Load training data from provided CSV path.
    
    Returns:
        X: Features (ph, temperature, turbidity, dissolved_oxygen)
        y: Target (quality labels as integers, expected: 0=Baik, 1=Normal, 2=Perlu Perhatian)
    """
    print("Loading training data...")
    if not os.path.exists(csv_path):
        print(f"⚠️  Dataset not found at: {csv_path}")
        return None, None
    data = pd.read_csv(csv_path)
    required_cols = ['pH', 'Temperature (°C)', 'Turbidity (NTU)', 'DO (mg/L)', 'Pollution_Level']
    missing = [c for c in required_cols if c not in data.columns]
    if missing:
        print(f"⚠️  Missing required columns in dataset: {missing}")
        return None, None
    # Map to expected feature names and order
    X = data[['pH', 'Temperature (°C)', 'Turbidity (NTU)', 'DO (mg/L)']].copy()
    X.columns = ['ph', 'temperature', 'turbidity', 'dissolved_oxygen']
    y = data['Pollution_Level'].astype(int)
    return X.values, y.values


def preprocess_data(X, y):
    """
    Preprocess and split data
    
    Args:
        X: Features
        y: Target
        
    Returns:
        X_train, X_test, y_train, y_test, scaler
    """
    print("Preprocessing data...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler


def train_model(X_train, y_train):
    """
    Train the model
    
    Args:
        X_train: Training features
        y_train: Training target
        
    Returns:
        Trained model
    """
    print("Training model...")
    
    # Random Forest with class_weight to handle imbalance
    model = RandomForestClassifier(
        n_estimators=400,
        max_depth=None,
        random_state=42,
        n_jobs=-1,
        class_weight='balanced_subsample'
    )
    
    # Option 2: Neural Network
    # model = MLPClassifier(
    #     hidden_layer_sizes=(64, 32, 16),
    #     activation='relu',
    #     solver='adam',
    #     max_iter=1000,
    #     random_state=42
    # )
    
    model.fit(X_train, y_train)
    
    return model


def evaluate_model(model, X_test, y_test):
    """
    Evaluate model performance
    
    Args:
        model: Trained model
        X_test: Test features
        y_test: Test target
    """
    from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, precision_recall_fscore_support
    
    print("\nEvaluating model...")
    
    # Predictions
    y_pred = model.predict(X_test)
    
    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, 
                                target_names=['Baik', 'Normal', 'Perlu Perhatian']))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    # Macro metrics (more fair for imbalance)
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_test, y_pred, average='macro', zero_division=0
    )
    print(f"\nMacro Precision: {precision:.4f}")
    print(f"Macro Recall:    {recall:.4f}")
    print(f"Macro F1-score:  {f1:.4f}")


def save_model(model, scaler, X_test, y_test):
    """
    Save trained model and scaler
    
    Args:
        model: Trained model
        scaler: Fitted scaler
    """
    print("\nSaving model and metadata...")
    
    # Create directory if not exists
    os.makedirs('models/trained', exist_ok=True)
    
    # Filenames expected by inference service
    model_path = 'models/trained/water_quality_rf_model.pkl'
    scaler_path = 'models/trained/scaler.pkl'
    metadata_path = 'models/trained/model_metadata.pkl'
    
    # Save model and scaler
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    
    # Compute evaluation for metadata
    from sklearn.metrics import accuracy_score, precision_recall_fscore_support
    y_pred = model.predict(X_test)
    accuracy = float(accuracy_score(y_test, y_pred))
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_test, y_pred, average='macro', zero_division=0
    )
    
    # Feature importance mapping
    feature_names = ['ph', 'temperature', 'turbidity', 'dissolved_oxygen']
    importances = getattr(model, 'feature_importances_', None)
    if importances is not None:
        feature_importance = {name: float(imp) for name, imp in zip(feature_names, importances)}
    else:
        feature_importance = {name: None for name in feature_names}
    
    # Label mapping used by inference (index -> class name)
    label_mapping = {0: 'Baik', 1: 'Normal', 2: 'Perlu Perhatian'}
    
    metadata = {
        'model_type': 'RandomForestClassifier',
        'feature_names': feature_names,
        'label_mapping': label_mapping,
        'accuracy': accuracy,
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1),
        'training_date': datetime.utcnow().isoformat() + 'Z',
        'feature_importance': feature_importance,
    }
    joblib.dump(metadata, metadata_path)
    
    print("Model and metadata saved successfully!")


def main():
    """Main training pipeline"""
    print("="*50)
    print("Water Quality Model Training")
    print("="*50)
    
    # Load data
    X, y = load_data()
    
    if X is None or y is None:
        print("\n⚠️  No training data available yet.")
        print("Please prepare training data in 'data/processed/training_data.csv'")
        print("\nData format should be:")
        print("ph, temperature, turbidity, dissolved_oxygen, quality")
        print("7.2, 28.5, 15.3, 6.8, Baik")
        return
    
    # Preprocess
    X_train, X_test, y_train, y_test, scaler = preprocess_data(X, y)
    
    # Train
    model = train_model(X_train, y_train)
    
    # Evaluate
    evaluate_model(model, X_test, y_test)
    
    # Save
    save_model(model, scaler, X_test, y_test)
    
    print("\n" + "="*50)
    print("Training completed successfully!")
    print("="*50)


if __name__ == '__main__':
    main()

