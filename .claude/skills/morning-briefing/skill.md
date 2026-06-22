---
name: morning-briefing
description: Generates and displays the CodeAIPulse morning briefing. Shows today's briefing, pending tasks, and a suggested focus.
trigger: /morning-briefing
effort: low
---

# Morning Briefing Skill

Displays your daily briefing from CodeAIPulse and shows task status.

**Requires:** Backend running on http://localhost:8000

## Execution

```js
import { writeFileSync, mkdirSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

const API = 'http://localhost:8000'

async function getMorningBriefing() {
  try {
    // Fetch today's briefing
    const briefingRes = await fetch(`${API}/briefing`)
    if (!briefingRes.ok) throw new Error('Failed to fetch briefing')
    const briefing = await briefingRes.json()

    // Fetch all tasks
    const tasksRes = await fetch(`${API}/tasks`)
    if (!tasksRes.ok) throw new Error('Failed to fetch tasks')
    const tasks = await tasksRes.json()

    // Calculate task stats
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    
    const pending = tasks.filter(t => !t.completed)
    const completedYesterday = tasks.filter(t => 
      t.completed && t.completed_at?.startsWith(yesterday)
    )

    // Build suggested focus from pending tasks
    let suggestedFocus = 'Balance deep work with team collaboration'
    if (pending.length > 0) {
      const taskTitles = pending.slice(0, 2).map(t => t.title).join(', ')
      suggestedFocus = `Focus on: ${taskTitles}${pending.length > 2 ? `, +${pending.length - 2} more` : ''}`
    }

    // Build formatted output
    const output = [
      '\n═══════════════════════════════════════════════════════════',
      '🌅  CodeAIPulse Morning Briefing',
      '═══════════════════════════════════════════════════════════\n',
    ]

    if (briefing.quote) {
      output.push('💡 Quote of the Day:')
      output.push(`   "${briefing.quote}"\n`)
    }

    if (briefing.focus_tip) {
      output.push('🎯 Focus Tip:')
      output.push(`   ${briefing.focus_tip}\n`)
    }

    if (briefing.message) {
      output.push('📝 Thought for Today:')
      output.push(`   ${briefing.message}\n`)
    }

    output.push('───────────────────────────────────────────────────────────')
    output.push('📊 Task Status:')
    output.push(`   • Pending Tasks: ${pending.length}`)
    output.push(`   • Completed Yesterday: ${completedYesterday.length}`)
    output.push(`\n🎯 ${suggestedFocus}`)
    output.push('\n═══════════════════════════════════════════════════════════\n')

    const formattedOutput = output.join('\n')
    
    // Display in terminal
    console.log(formattedOutput)

    // Save to file
    const briefingDir = join(homedir(), '.claude', 'briefings')
    mkdirSync(briefingDir, { recursive: true })
    const filename = join(briefingDir, `briefing-${today}.txt`)
    writeFileSync(filename, formattedOutput)
    console.log(`✅ Briefing saved to: ${filename}\n`)

  } catch (err) {
    console.error('❌ Error:', err.message)
    console.error('   Make sure the backend is running: uvicorn main:app --reload')
    process.exit(1)
  }
}

await getMorningBriefing()
```

## Usage

Run at the start of your work session:
```
/morning-briefing
```

The skill will display:
- Your motivational quote for the day
- A practical focus tip
- An encouraging message
- How many tasks are pending
- Completed tasks from yesterday
- A suggested focus area based on your workload
