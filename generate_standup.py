import urllib.request
import json
import sys
import io

# Set stdout encoding to UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

API = 'http://localhost:8000'

try:
    # Get standup
    with urllib.request.urlopen(f'{API}/standup') as resp:
        standup_data = json.loads(resp.read().decode())
        standup_text = standup_data.get('standup', '')

    # Get tasks
    with urllib.request.urlopen(f'{API}/tasks') as resp:
        tasks = json.loads(resp.read().decode())

    pending = [t for t in tasks if not t.get('completed')]

    # Display standup
    print()
    print('═' * 60)
    print('📋 Your Standup:')
    print('═' * 60)
    print()
    print('✅ COMPLETED')
    print(standup_text)
    print()
    print('🔨 NEXT')
    if pending:
        for task in pending[:3]:
            title = task['title']
            print('• ' + title)
    else:
        print('• No pending tasks — all caught up!')
    print()
    print('🚧 BLOCKERS')
    print('None')
    print()
    print('═' * 60)
    print()

except Exception as e:
    print(f'Error: {e}')
