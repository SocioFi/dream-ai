from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from openai import AzureOpenAI
import logging
import base64
from PIL import Image
import io
import requests
import sys
import traceback

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Set Azure API endpoints and credentials
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_DEPLOYMENT = "gpt-4o"  # Updated deployment name
DALLE_ENDPOINT = os.getenv("DALLE_ENDPOINT")
DALLE_API_KEY = os.getenv("DALLE_API_KEY")
DALLE_DEPLOYMENT = "dall-e-3"

# Log configuration
logger.info(f"Azure OpenAI Endpoint: {AZURE_OPENAI_ENDPOINT}")
logger.info(f"Azure OpenAI API Key: {'Set' if AZURE_OPENAI_API_KEY else 'Not Set'}")
logger.info(f"Azure OpenAI Deployment: {AZURE_OPENAI_DEPLOYMENT}")
logger.info(f"DALLE Endpoint: {DALLE_ENDPOINT}")
logger.info(f"DALLE API Key: {'Set' if DALLE_API_KEY else 'Not Set'}")

# Initialize OpenAI clients
try:
    openai_client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version="2024-02-01",
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
    )
    logger.info("Successfully initialized OpenAI client")
except Exception as e:
    logger.error(f"Failed to initialize OpenAI client: {str(e)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    raise

try:
    dalle_client = AzureOpenAI(
        api_key=os.getenv("DALLE_API_KEY"),
        api_version="2024-02-01",
        azure_endpoint=os.getenv("DALLE_API_KEY")
    )
    logger.info("Successfully initialized DALLE client")
except Exception as e:
    logger.error(f"Failed to initialize DALLE client: {str(e)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    raise

class DreamRequest(BaseModel):
    dream: str

class GenerateRequest(BaseModel):
    type: str
    dream: str
    theme: str

class DreamResponse(BaseModel):
    theme: str

class GenerateResponse(BaseModel):
    output: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    background_image: Optional[str] = None

app = FastAPI()

# Configure CORS
allowed_origins = [
    "http://localhost:3000",  # Local development
    "http://localhost:3001",  # Alternative local port
    "http://localhost:3002",  # Alternative local port
    "https://dreamai-frontend.azurewebsites.net",  # Production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_dream_theme(dream_text: str) -> str:
    """Analyze dream to extract its main theme"""
    try:
        logger.info(f"Starting dream analysis for text: {dream_text}")
        
        if not dream_text:
            logger.error("Empty dream text provided")
            raise ValueError("Dream text cannot be empty")

        system_prompt = """Analyze the provided dream and extract its main theme or central emotion.
        Provide a brief, focused response that captures the essence of the dream in 1-2 sentences."""

        logger.info("Creating chat completion request")
        logger.info(f"Using deployment: {AZURE_OPENAI_DEPLOYMENT}")
        
        try:
            response = openai_client.chat.completions.create(
                model=AZURE_OPENAI_DEPLOYMENT,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": dream_text}
                ],
                temperature=0.7,
                max_tokens=100
            )
            logger.info("Successfully received response from OpenAI")
        except Exception as e:
            logger.error(f"Error during OpenAI API call: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
        
        theme = response.choices[0].message.content.strip()
        logger.info(f"Generated theme: {theme}")
        return theme
    except Exception as e:
        logger.error(f"Error in analyze_dream_theme: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

def generate_story(dream: str, theme: str) -> str:
    """Generate a story based on the dream and theme"""
    try:
        prompt = f"""Create a short story based on this dream: {dream}
        Theme to emphasize: {theme}
        
        The story should be engaging, creative, and maintain the dream's emotional essence.
        Keep it concise but impactful, around 3-4 paragraphs."""

        response = openai_client.chat.completions.create(
            model=AZURE_OPENAI_DEPLOYMENT,
            messages=[
                {"role": "system", "content": "You are a creative writer specializing in dream-inspired stories."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=500
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Error in generate_story: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

def generate_poem(dream: str, theme: str) -> str:
    """Generate a poem based on the dream and theme"""
    try:
        prompt = f"""Create a poem inspired by this dream: {dream}
        Theme to emphasize: {theme}
        
        The poem should be evocative and capture the dream's atmosphere.
        Keep it concise, around 8-12 lines."""

        response = openai_client.chat.completions.create(
            model=AZURE_OPENAI_DEPLOYMENT,
            messages=[
                {"role": "system", "content": "You are a poet specializing in dream-inspired verses."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=200
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Error in generate_poem: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

def generate_dream_image(dream: str, theme: str) -> str:
    """Generate dream visualization using DALL-E"""
    try:
        prompt = f"""Create a detailed, dreamlike illustration that captures this theme: {theme}
        Dream context: {dream}
        Style: Surreal and fantastical digital art
        Colors: Rich and vibrant with ethereal lighting
        Composition: Dynamic and balanced with focal points
        Mood: Mysterious and enchanting
        Quality: High detail and polish
        NO text or words in the image"""
        
        response = dalle_client.images.generate(
            model=DALLE_DEPLOYMENT,
            prompt=prompt,
            n=1,
            size="1024x1024",
            quality="standard",
            style="vivid"
        )
        
        return response.data[0].url
    except Exception as e:
        logger.error(f"Error in generate_dream_image: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-dream", response_model=DreamResponse)
async def analyze_dream_endpoint(request: DreamRequest):
    """Analyze dream to extract theme"""
    try:
        logger.info(f"Received dream analysis request: {request.dream}")
        theme = analyze_dream_theme(request.dream)
        logger.info(f"Analysis complete. Theme: {theme}")
        return DreamResponse(theme=theme)
    except Exception as e:
        logger.error(f"Error in analyze_dream_endpoint: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate", response_model=GenerateResponse)
async def generate_endpoint(request: GenerateRequest):
    """Generate content based on dream and theme"""
    try:
        if request.type == "story":
            output = generate_story(request.dream, request.theme)
        elif request.type == "poem":
            output = generate_poem(request.dream, request.theme)
        elif request.type == "image":
            output = generate_dream_image(request.dream, request.theme)
        else:
            raise HTTPException(status_code=400, detail="Invalid generation type")
            
        return GenerateResponse(output=output)
    except Exception as e:
        logger.error(f"Error in generate_endpoint: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Handle chat interactions"""
    try:
        # For now, just return the message as is
        return ChatResponse(
            response=request.message,
            background_image=None
        )
    except Exception as e:
        logger.error(f"Error in chat_endpoint: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    
    # Get port from environment variable for Azure, default to 8001 for local development
    port = int(os.getenv("PORT", "8000"))
    
    # Log startup configuration
    logger.info(f"Starting server on port {port}")
    logger.info(f"CORS allowed origins: {allowed_origins}")
    
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=port,
            proxy_headers=True,
            forwarded_allow_ips="*",
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        sys.exit(1)
