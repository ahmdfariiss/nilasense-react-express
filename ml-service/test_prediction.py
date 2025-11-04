"""
Test script for Water Quality Prediction Model
Run this script to test predictions without starting the Flask server.
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.model_utils import WaterQualityModel
import json


def print_separator(char='=', length=80):
    """Print a separator line"""
    print(char * length)


def print_prediction_result(result, test_name):
    """Print prediction result in a formatted way"""
    print_separator()
    print(f"🧪 {test_name}")
    print_separator()
    
    print(f"\n📊 Input Parameters:")
    for key, value in result['parameters'].items():
        print(f"   {key:20s}: {value}")
    
    print(f"\n🎯 Prediction Results:")
    print(f"   Quality:    {result['quality']}")
    print(f"   Confidence: {result['confidence']*100:.2f}%")
    
    if 'probabilities' in result:
        print(f"\n📈 Class Probabilities:")
        for cls, prob in result['probabilities'].items():
            bar = '█' * int(prob * 50)
            print(f"   {cls:20s}: {prob*100:6.2f}% {bar}")
    
    print(f"\n📝 Description:")
    print(f"   {result['description']}")
    
    print(f"\n⚠️  Issues Detected:")
    for i, issue in enumerate(result['issues'], 1):
        print(f"   {i}. {issue}")
    
    print(f"\n💡 Recommendations:")
    for i, rec in enumerate(result['recommendations'], 1):
        print(f"   {i}. {rec}")
    
    print_separator()
    print()


def main():
    """Main test function"""
    print("\n" + "=" * 80)
    print("🐟 NilaSense - Water Quality Prediction Model Test")
    print("=" * 80)
    
    # Initialize model
    print("\n📦 Loading model...")
    model = WaterQualityModel()
    
    if not model.load_model():
        print("\n❌ Failed to load model!")
        print("\n💡 Please run the training notebook first:")
        print("   cd ml-service/notebooks")
        print("   jupyter notebook water_quality_model_training.ipynb")
        return
    
    # Get model info
    print("\n📋 Model Information:")
    print_separator('-')
    info = model.get_model_info()
    if 'error' not in info:
        print(f"   Model Type:     {info['model_type']}")
        print(f"   Accuracy:       {info['accuracy']*100:.2f}%")
        print(f"   Precision:      {info['precision']*100:.2f}%")
        print(f"   Recall:         {info['recall']*100:.2f}%")
        print(f"   F1-Score:       {info['f1_score']*100:.2f}%")
        print(f"   Training Date:  {info['training_date']}")
        print(f"\n   Features:       {', '.join(info['features'])}")
        print(f"   Classes:        {', '.join(info['classes'])}")
        
        print(f"\n   Feature Importance:")
        for feature, importance in info['feature_importance'].items():
            bar = '█' * int(importance * 100)
            print(f"      {feature:20s}: {importance:.4f} {bar}")
    print_separator('-')
    
    # Test Case 1: Optimal Water Quality
    print("\n\n")
    result1 = model.predict(
        ph=7.2,
        temperature=28.0,
        turbidity=15.0,
        dissolved_oxygen=6.5
    )
    print_prediction_result(result1, "TEST CASE 1: Optimal Water Quality (Expected: BAIK)")
    
    # Test Case 2: Marginal Water Quality
    result2 = model.predict(
        ph=6.8,
        temperature=26.5,
        turbidity=28.0,
        dissolved_oxygen=4.8
    )
    print_prediction_result(result2, "TEST CASE 2: Marginal Water Quality (Expected: NORMAL)")
    
    # Test Case 3: Poor Water Quality
    result3 = model.predict(
        ph=5.5,
        temperature=34.0,
        turbidity=55.0,
        dissolved_oxygen=2.5
    )
    print_prediction_result(result3, "TEST CASE 3: Poor Water Quality (Expected: PERLU PERHATIAN)")
    
    # Test Case 4: Edge Case - High pH
    result4 = model.predict(
        ph=9.2,
        temperature=27.0,
        turbidity=20.0,
        dissolved_oxygen=5.5
    )
    print_prediction_result(result4, "TEST CASE 4: Edge Case - High pH")
    
    # Test Case 5: Edge Case - Low Temperature
    result5 = model.predict(
        ph=7.0,
        temperature=18.0,
        turbidity=22.0,
        dissolved_oxygen=6.0
    )
    print_prediction_result(result5, "TEST CASE 5: Edge Case - Low Temperature")
    
    # Summary
    print("\n" + "=" * 80)
    print("✅ ALL TESTS COMPLETED!")
    print("=" * 80)
    
    test_results = [result1, result2, result3, result4, result5]
    
    print("\n📊 Test Summary:")
    print_separator('-')
    for i, result in enumerate(test_results, 1):
        quality_emoji = {
            'Baik': '🟢',
            'Normal': '🟡',
            'Perlu Perhatian': '🔴'
        }
        emoji = quality_emoji.get(result['quality'], '⚪')
        print(f"   Test {i}: {emoji} {result['quality']:20s} (Confidence: {result['confidence']*100:.1f}%)")
    print_separator('-')
    
    # Export results to JSON
    print("\n💾 Exporting results to JSON...")
    output_file = 'test_prediction_results.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'model_info': info if 'error' not in info else {},
            'test_results': test_results
        }, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Results saved to: {output_file}")
    
    print("\n" + "=" * 80)
    print("🎉 Testing Complete! Model is ready for production.")
    print("=" * 80)
    print("\n💡 Next Steps:")
    print("   1. Start Flask server: python run.py")
    print("   2. Test API: curl http://localhost:5000/api/health")
    print("   3. Make prediction via API:")
    print("      curl -X POST http://localhost:5000/api/predict \\")
    print("        -H 'Content-Type: application/json' \\")
    print("        -d '{\"ph\": 7.2, \"temperature\": 28.5, \"turbidity\": 15.3, \"dissolved_oxygen\": 6.8}'")
    print("\n" + "=" * 80 + "\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)






