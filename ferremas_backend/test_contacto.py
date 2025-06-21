import requests
import json

def test_contact_endpoint():
    url = 'http://localhost:8000/api/contacto/'
    data = {
        'nombre': 'Test User',
        'email': 'test@test.com',
        'asunto': 'Test Subject',
        'mensaje': 'This is a test message'
    }
    
    try:
        response = requests.post(url, json=data)
        print(f'Status Code: {response.status_code}')
        print(f'Response: {response.text}')
        
        if response.status_code == 201:
            print('✅ Endpoint working correctly!')
        else:
            print('❌ Endpoint not working as expected')
            
    except requests.exceptions.ConnectionError:
        print('❌ Could not connect to server. Make sure Django is running on port 8000')
    except Exception as e:
        print(f'❌ Error: {e}')

if __name__ == '__main__':
    test_contact_endpoint() 