---
company: Manus
model: Manus
date: 2025-03-10
title: Manus System Prompt
description: The leaked Manus system prompt at March 10, 2025.
seo_title: Manus System Prompt leaked at (2025-03-10)
seo_description: View Manus system prompt leaked on 2025-03-10. It contains 4 parts, the agent loop, modules, prompt, and tools.
source: https://gist.github.com/jlia0/db0a9695b3ca7609c9b1a08dcbf872c9
---

This is a leaked Manus system prompt from March 10, 2025. It contains 4 parts: the agent loop, modules, prompt, and tools. The initial prompt was leaked on [X](https://x.com/jianxliao/status/1898861051183349870), and finally, the entire prompt was revealed on [GitHub gist from jlia0](https://gist.github.com/jlia0/db0a9695b3ca7609c9b1a08dcbf872c9).  Now we provide all theses 4 parts in this page.

<!-- give a general summary for each part -->

- [Agent Loop](#agent-loop):
- [Modules](#modules)
- [Prompt](#prompt)
- [Tools](#tools)

Here's a concise summary of each section:

### 1. Agent Loop
Describes the iterative workflow of the Manus AI agent:
- **Core Process**: Analyze events → Select tools → Execute → Iterate → Submit results → Standby
- **Key Principles**: Single tool call per iteration, focus on latest events, prioritize user messages
- **Output Handling**: Deliver results via messages with attachments, verify completion before standby
- **Language**: Strict English-first policy unless user specifies otherwise

### 2. Modules
Defines the system architecture and operational rules:
- **Core Capabilities**: Information processing, content creation, coding, deployment, and problem-solving
- **Key Modules**:
  - *Planner*: Provides step-by-step pseudocode task plans
  - *Knowledge*: Offers best practices and reference information
  - *Datasource*: Accesses authoritative APIs with strict usage protocols
- **Operational Rules**:
  - File handling with version control via `todo.md`
  - Browser interaction requiring deep page analysis
  - Shell usage favoring automated commands
  - Writing requiring paragraph-based long-form content
  - Error handling through iterative troubleshooting

### 3. Prompt
Outlines user-facing capabilities and interaction guidelines:
- **Functional Areas**:
  - Information processing (research, fact-checking)
  - Content creation (articles, reports, code)
  - Technical execution (deployment, system operations)
  - Problem-solving methodology
- **Technology Stack**: Python/JS/HTML/CSS, React/Node.js/Django, data analysis libraries
- **Interaction Principles**:
  - Clear prompting techniques (specificity, context, format)
  - Iterative refinement process
  - Code request best practices
- **Identity Declaration**: Service-oriented AI with focus on accuracy, ethics, and transparency

### 4. Tools
Catalog of executable functions with strict usage parameters:
- **Communication Tools**:
  - `message_notify_user` (non-blocking updates)
  - `message_ask_user` (blocking queries)
- **File Operations**: Read/write/replace/search with sudo support
- **Shell Management**: Session-based execution with process control
- **Browser Interaction**: Navigation, element control, scrolling, and console access
- **Specialized Tools**:
  - Web search (`info_search_web`)
  - Deployment (`deploy_expose_port`, `deploy_apply_deployment`)
  - Content conversion (`make_manus_page`)
- **Termination Signal**: `idle` indicates task completion

The system combines structured workflows, specialized modules, and granular tooling to handle complex digital tasks while maintaining strict operational protocols and user-centric communication.
