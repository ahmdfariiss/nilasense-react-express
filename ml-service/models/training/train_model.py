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
import os

def load_data():
    """
    Load training data
    
    Returns:
        X: Features (pH, temperature, turbidity, dissolved_oxygen)
        y: Target (quality labels: 0=Buruk, 1=Normal, 2=Baik)
    """
    # TODO: Load actual dataset
    # For now, return None
    print("Loading training data...")
    # data = pd.read_csv('data/processed/training_data.csv')
    # X = data[['ph', 'temperature', 'turbidity', 'dissolved_oxygen']]
    # y = data['quality']
    return None, None


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
    
    # Option 1: Random Forest
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
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
    from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
    
    print("\nEvaluating model...")
    
    # Predictions
    y_pred = model.predict(X_test)
    
    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, 
                                target_names=['Buruk', 'Normal', 'Baik']))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))


def save_model(model, scaler):
    """
    Save trained model and scaler
    
    Args:
        model: Trained model
        scaler: Fitted scaler
    """
    print("\nSaving model...")
    
    # Create directory if not exists
    os.makedirs('models/trained', exist_ok=True)
    
    # Save model
    joblib.dump(model, 'models/trained/water_quality_model.pkl')
    joblib.dump(scaler, 'models/trained/scaler.pkl')
    
    print("Model saved successfully!")


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
    save_model(model, scaler)
    
    print("\n" + "="*50)
    print("Training completed successfully!")
    print("="*50)


if __name__ == '__main__':
    main()

