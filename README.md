# Mario Coding Game Backend

A FastAPI-based backend service for an educational Mario-style coding game that teaches programming concepts through interactive gameplay.

## Features

- **Interactive Coding Challenges**: Mario-themed levels with programming objectives
- **AI-Powered Feedback**: Intelligent hints and feedback using Anthropic's Claude API
- **Session Management**: Track player progress and game state
- **Code Validation**: Automated checking of player solutions
- **RESTful API**: Clean, documented endpoints for frontend integration

## Quick Start

### Prerequisites

- Python 3.8+
- Anthropic API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mario-coding-game-backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your Anthropic API key
   ```

4. **Run the server**
   ```bash
   uvicorn main:app --reload
   ```

5. **Access the API**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

## API Endpoints

### Health Check
```http
GET /health
```
Returns server status and version information.

### Session Management

#### Start New Session
```http
POST /session/start
```
Creates a new game session and returns session ID.

#### Reset Session
```http
POST /session/reset
```
Resets current session progress.

#### Get Session Details
```http
GET /session/{session_id}
```
Returns current session state and progress.

### Game Interaction

#### Execute Code
```http
POST /execute
```
Submits player code for validation and returns feedback.

**Request Body:**
```json
{
  "session_id": "uuid",
  "level": 1,
  "objective": 1,
  "code": ["move_forward()", "jump()"],
  "lives": 3
}
```

#### Get Hint
```http
POST /hint
```
Requests AI-powered hint for current level.

**Request Body:**
```json
{
  "session_id": "uuid",
  "level": 1,
  "objective": 1,
  "code": ["move_forward()"]
}
```

## Game Levels

### Level 1: Baby Steps
- **Objective 1**: Move Mario forward
- **Objective 2**: Make Mario jump

### Level 2: Activation & Terminations
- **Objective 1**: Activate the bridge lever
- **Objective 2**: Navigate to the goal

## Architecture

```
api/
├── models.py          # Pydantic data models
├── routers/           # API route handlers
│   ├── health.py      # Health check endpoint
│   ├── session.py     # Session management
│   ├── execute.py     # Code execution
│   └── hint.py        # Hint generation
└── services/          # Business logic
    ├── game_service.py           # Main game orchestration
    ├── session_service.py        # Session management
    ├── game_context_reader.py    # Level definitions
    └── zypher_agent_service.py   # AI integration
```

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key for AI features
- `FAST_API_HOST`: Server host (default: 0.0.0.0)
- `FAST_API_PORT`: Server port (default: 8000)
- `FAST_API_DEBUG`: Debug mode (default: True)
- `DEFAULT_LIVES`: Starting lives per session (default: 3)

## Development

### Running Tests
```bash
python -m pytest
```

### Code Formatting
```bash
black .
flake8 .
```

### API Documentation
FastAPI automatically generates interactive API documentation available at `/docs` when running the server.

## Deployment

### Docker
```bash
docker build -t mario-coding-game .
docker run -p 8000:8000 mario-coding-game
```

### Production
For production deployment, consider:
- Using a production ASGI server like Gunicorn with Uvicorn workers
- Setting up proper logging and monitoring
- Configuring environment variables securely
- Using a proper database instead of JSON file storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.