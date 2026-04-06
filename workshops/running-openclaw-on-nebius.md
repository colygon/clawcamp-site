# Running OpenClaw on Nebius
## 30-Minute Workshop Presentation

**Event:** ClawCamp Workshop Series
**Duration:** 30 minutes (15 min presentation + 15 min hands-on)
**Level:** Beginner
**Prerequisites:** Laptop with browser, Nebius account (free trial), Node.js 18+

---

## SLIDE 1: Title

**Running OpenClaw on Nebius**
From zero to a live AI agent in 15 minutes

ClawCamp Workshop
claw.camp/curriculum/agent-inference

---

## SLIDE 2: The Problem

**Running AI agents is expensive and complicated**

- A Mac Mini for local inference: $1,000+
- Exposes your home network
- Runs ONE agent at a time
- No scaling, no redundancy, no sleep

**What if you could run 100 agents for the cost of one Mac Mini?**

---

## SLIDE 3: The Solution

**OpenClaw + Token Factory on Nebius**

| Component | What it does |
|-----------|-------------|
| **OpenClaw** | Agent orchestration + WebSocket gateway (runs on CPU) |
| **Token Factory** | Managed inference API with 30+ models (runs on GPU) |
| **Nebius Serverless** | Auto-scaling compute (pay only when active) |

**Key insight:** Orchestration and inference are separate. Your agent logic runs on cheap CPU. The expensive GPU work goes through Token Factory's pay-per-token API.

---

## SLIDE 4: Three Deployment Patterns

| Pattern | Best For | Cost (10K msgs/day) | Cold Start |
|---------|----------|-------------------|------------|
| **Local + Token Factory** | Prototyping, dev | ~$15-30/mo | None |
| **CPU Serverless + Token Factory** | Production, zero-ops | ~$20-40/mo | 2-5 sec |
| **GPU Serverless + Local Model** | Low latency, high throughput | ~$200-800/mo | 30-60 sec |

**Today we'll do Pattern 1 (fastest) and show how to upgrade to Pattern 2.**

---

## SLIDE 5: What You'll Build

By the end of this workshop:

1. A live OpenClaw agent connected to Token Factory
2. Structured tool-calling with JSON mode
3. A working deployment you can take home

**Let's do it.**

---

## SLIDE 6: Step 1 — Get Your Token Factory API Key (2 min)

1. Go to **console.nebius.com**
2. Navigate to **Token Factory** in the sidebar
3. Click **Create API Key**
4. Copy the key (starts with `eyJ...`)

```
export NEBIUS_API_KEY="your-key-here"
```

**This key gives you access to 30+ models including Llama 3.1 70B, DeepSeek-R1, and Mistral.**

---

## SLIDE 7: Step 2 — Install OpenClaw (1 min)

```bash
npm install -g @openclaw/cli
```

Verify:
```bash
openclaw --version
```

That's it. OpenClaw is a Node.js package. No Docker, no containers, no VMs.

---

## SLIDE 8: Step 3 — Configure and Start (2 min)

Create your config:
```bash
openclaw init
```

Set your Token Factory endpoint:
```bash
export OPENCLAW_INFERENCE_URL="https://api.tokenfactory.nebius.com/v1"
export OPENCLAW_INFERENCE_KEY="$NEBIUS_API_KEY"
export OPENCLAW_MODEL="meta-llama/Meta-Llama-3.1-70B-Instruct"
```

Start the gateway:
```bash
openclaw start
```

**Your agent is now live at `http://localhost:18789`**

---

## SLIDE 9: Step 4 — Open the Dashboard (1 min)

Open your browser to:

**`http://localhost:18789`**

You'll see the Control UI with:
- Connected agents
- Message history
- Model selection
- Token usage

**This is your command center.**

---

## SLIDE 10: Step 5 — Build a Tool-Calling Workflow (5 min)

The real power of OpenClaw is **structured outputs**. Your agent can call tools reliably using JSON mode.

Example: A weather agent that:
1. Receives a natural language query
2. Extracts the city using structured output
3. Calls a weather API
4. Returns a formatted response

```json
{
  "tool": "get_weather",
  "arguments": {
    "city": "Oakland",
    "units": "fahrenheit"
  }
}
```

**Token Factory supports JSON mode natively — no prompt engineering hacks needed.**

---

## SLIDE 11: Model Selection

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| **Llama 3.1 70B** | Fast | High | General agents, tool calling |
| **DeepSeek-R1** | Medium | Very High | Reasoning, complex tasks |
| **Mistral Large** | Fast | High | Code generation |
| **GLM-5** | Very Fast | Good | Simple tasks, high throughput |

**Tip:** Start with Llama 3.1 70B. It's the best balance of speed, quality, and cost for most agent workloads.

---

## SLIDE 12: Cost Breakdown

**What does this actually cost?**

| Usage | Tokens/day | Cost/day | Cost/month |
|-------|-----------|----------|------------|
| Light (100 msgs) | ~500K | $0.15 | $4.50 |
| Medium (1K msgs) | ~5M | $1.50 | $45 |
| Heavy (10K msgs) | ~50M | $15 | $450 |

Compare: A single H100 GPU costs **$2-3/hour** = **$1,500-2,200/month**

**Token Factory lets you pay per token, not per hour.**

---

## SLIDE 13: Going to Production (Pattern 2)

When you're ready to deploy:

```bash
# Install Nebius CLI
curl -sSL https://storage.ai.nebius.cloud/ncp/install.sh | bash

# Get your network IDs
ncp vpc network list
ncp vpc subnet list

# Deploy OpenClaw on Nebius Serverless
ncp serverless container create \
  --name openclaw-agent \
  --image openclaw/gateway:latest \
  --memory 512MB \
  --execution-timeout 300s
```

**Your agent now auto-scales to zero when idle and spins up on demand.**

---

## SLIDE 14: Security Checklist

Before going live:

- [ ] Set a gateway token (auth for all connections)
- [ ] Bind to loopback in dev, 0.0.0.0 in production behind a proxy
- [ ] Enable HTTPS via reverse proxy (nginx/Caddy)
- [ ] Set API budget caps in Token Factory
- [ ] Use network security groups to restrict port access

---

## SLIDE 15: Troubleshooting Quick Reference

| Problem | Fix |
|---------|-----|
| Gateway won't start | Check port 18789 isn't in use: `lsof -i :18789` |
| Token Factory 401 | Verify API key: `curl -H "Authorization: Bearer $KEY" https://api.tokenfactory.nebius.com/v1/models` |
| Slow responses | Switch to a faster model (GLM-5) or check network latency |
| OOM crash | Increase memory limit or reduce concurrent agents |
| Connection refused | Check bind address and firewall rules |

---

## SLIDE 16: What You Built Today

1. Installed OpenClaw locally
2. Connected to Nebius Token Factory
3. Selected a model and configured structured outputs
4. Understood three deployment patterns
5. Know how to go from prototype to production

**Your agent is live. Take it home and build something.**

---

## SLIDE 17: Resources

| Resource | Link |
|----------|------|
| OpenClaw Docs | docs.openclaw.ai |
| Token Factory | console.nebius.com |
| ClawCamp Tutorials | claw.camp/curriculum |
| Agent Inference Workshop | claw.camp/curriculum/agent-inference |
| Deployment Patterns | claw.camp/curriculum/deploy-patterns |
| Three Architectures | claw.camp/curriculum/deploy-architecture |
| Discord | discord.gg/clawcamp |

---

## SLIDE 18: Next Steps

**Beginner:** Try the other deployment methods
- Deploy via Web Console (20 min) — claw.camp/curriculum/deploy-console
- Deploy with Install Scripts (15 min) — claw.camp/curriculum/deploy-scripts

**Intermediate:** Build a multi-agent system
- Agent Lifecycle workshop (70 min) — claw.camp/curriculum/agent-lifecycle
- Private Agents for sensitive data (55 min) — claw.camp/curriculum/private-agents

**Advanced:** Add hardware
- Robotics with Solo CLI (75 min) — claw.camp/curriculum/robotics

---

## SLIDE 19: Thank You

**Running OpenClaw on Nebius**
From zero to a live AI agent in 15 minutes

Questions? Find us at:
- claw.camp
- discord.gg/clawcamp
- hello@claw.camp

**Join the personal AI revolution.**
