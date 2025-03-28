from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from openai import OpenAI
import os
from dotenv import load_dotenv
import base64
from io import BytesIO
from PIL import Image
import json
import requests
import re
from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("OPENAI_API_KEY")
print(api_key)
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development - change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/helix")  # Update with your credentials
database = Database(DATABASE_URL)
metadata = sa.MetaData()

# Define Sequence table
sequences = sa.Table(
    "sequences",
    metadata,
    sa.Column("id", sa.String, primary_key=True),
    sa.Column("user_id", sa.String),
    sa.Column("org_id", sa.String),
    sa.Column("name", sa.String),
    sa.Column("content", sa.Text),
    sa.Column("messages", sa.JSON),
    sa.Column("created_at", sa.DateTime, default=datetime.utcnow),
    sa.Column("updated_at", sa.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
)

class ChatMessage(BaseModel):
    text: str
    sender: str
    image: str | None = None

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class EmailSequence(BaseModel):
    content: str
    should_update_workspace: bool = False

class ChatResponse(BaseModel):
    text: str
    sender: str
    reasoning: str | None = None
    email_sequence: EmailSequence | None = None

# Pydantic models for request/response
class SequenceCreate(BaseModel):
    id: str
    user_id: str
    org_id: str
    name: str
    content: str
    messages: List[Dict[str, Any]]

class SequenceResponse(BaseModel):
    id: str
    user_id: str
    org_id: str
    name: str
    content: str
    messages: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# Add these new functions after the app initialization and before the routes
def get_user_details(user_id: str) -> dict:
    # TODO: Replace with actual database query
    return {
        "name": "John Doe",
        "title": "Technical Recruiter",
        "company": "TechCorp Inc.",
        "email": "john.doe@techcorp.com",
        "linkedin": "linkedin.com/in/johndoe"
    }

def get_organization_details(org_id: str) -> dict:
    # TODO: Replace with actual database query
    return {
        "name": "TechCorp Inc.",
        "industry": "Technology",
        "description": "Leading software development company specializing in AI and machine learning solutions",
        "website": "techcorp.com",
        "locations": ["San Francisco", "New York", "London"],
        "company_size": "500-1000 employees"
    }

# Update the chat endpoint to include user and org context
@app.post("/api/chat")
async def chat(
    messages: str = Form(...),
    workspace: str = Form(...),
    user_id: str = Form(None),
    org_id: str = Form(None)
):
    try:
        # Parse the messages JSON string
        messages_data = json.loads(messages)
        
        # Get user and organization details if IDs are provided
        user_details = get_user_details(user_id) 
        org_details = get_organization_details(org_id) 
        
        # Convert messages to OpenAI format
        formatted_messages = []
        print(user_details)
        print(org_details)
        
        # Update system message to include workspace, user, and organization context
        base_prompt = """You are an AI assistant that helps with recruiting outreach."""
        
        # Add context only if details are available
        if user_details:
            base_prompt += f"""
            
            USER CONTEXT:
            - Recruiter Name: {user_details.get('name', 'N/A')}
            - Title: {user_details.get('title', 'N/A')}
            - Company: {user_details.get('company', 'N/A')}
            - Email: {user_details.get('email', 'N/A')}"""
            
        if org_details:
            base_prompt += f"""
            
            ORGANIZATION CONTEXT:
            - Company: {org_details.get('name', 'N/A')}
            - Industry: {org_details.get('industry', 'N/A')}
            - Description: {org_details.get('description', 'N/A')}
            - Company Size: {org_details.get('company_size', 'N/A')}"""
            
        base_prompt += """
            
            When users ask about email sequences or recruiting messages:
            You need to generate sequence in following format:
            - First paragraph is main objective why you are sending this email
            - Second paragraph is the body of the email. You can add more details, like we are hiring for this specific skills and you have this skills while this project or experience.
            - Third paragraph is the closing of the email. You can add more details, like we are hiring for this specific skills and you have this skills while this project or experience.

            Use the user and organization context to personalize the messages appropriately.
            For non-email sequence related questions, set email_sequence to null and only provide Reasoning and Answer.
            
            IMPORTANT: Your response must be valid JSON without any additional text or formatting."""
            
        formatted_messages.extend([
            {
                "role": "system",
                "content": base_prompt
            },
            {
                "role": "system",
                "content": """You should generate response in JSON format with following keys:
                - text: str (Example: Based on your request, I have updated email sequence)
                - reasoning: str (Example: Candidate has 3 years of experience in Python and Django, and they are looking for a new opportunity)
                - email_sequence: object | null (For email sequences, use format: {"content": "email content here"}. For non-email queries, use null)
                
                IMPORTANT: Return only the JSON object, with no additional text, markdown, or code block formatting."""
            }
        ])
        
        for msg in messages_data:
            role = "assistant" if msg["sender"] == "assistant" else "user"
            formatted_messages.append({"role": role, "content": msg["text"]})

        # Call OpenAI API
        try:
            response = client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=formatted_messages
            )
        except Exception as e:
            print(f"Error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

        # Extract the response text and clean it
        bot_response = response.choices[0].message.content.strip()
        
        # Remove any potential markdown code block indicators
        bot_response = re.sub(r'^```json\s*|\s*```$', '', bot_response)
        
        try:
            # Parse the JSON response
            parsed_response = json.loads(bot_response)
            
            # Extract fields with defaults if not present
            answer = parsed_response.get('text', '')
            reasoning = parsed_response.get('reasoning', '')
            email_sequence_data = parsed_response.get('email_sequence', None)
            
            # Create EmailSequence object if email_sequence data exists and has content
            sequence = None
            if email_sequence_data and isinstance(email_sequence_data, dict) and email_sequence_data.get('content'):
                sequence = EmailSequence(
                    content=email_sequence_data.get('content', ''),
                    should_update_workspace=True
                )

            return {
                "message": {
                    "text": answer,
                    "sender": "assistant",
                    "reasoning": reasoning,
                    "email_sequence": sequence
                }
            }

        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON response: {bot_response}")
            raise HTTPException(status_code=500, detail="Failed to parse AI response")

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# New endpoint to store sequence
@app.post("/api/sequences", response_model=SequenceResponse)
async def create_sequence(sequence: SequenceCreate):
    try:
        query = sequences.select().where(sequences.c.id == sequence.id)
        existing_sequence = await database.fetch_one(query)
        
        current_time = datetime.utcnow()
        
        if existing_sequence:
            # Update existing sequence
            query = (
                sequences.update()
                .where(sequences.c.id == sequence.id)
                .values(
                    user_id=sequence.user_id,
                    org_id=sequence.org_id,
                    name=sequence.name,
                    content=sequence.content,
                    messages=sequence.messages,
                    updated_at=current_time
                )
            )
            await database.execute(query)
        else:
            # Create new sequence
            query = sequences.insert().values(
                id=sequence.id,
                user_id=sequence.user_id,
                org_id=sequence.org_id,
                name=sequence.name,
                content=sequence.content,
                messages=sequence.messages,
                created_at=current_time,
                updated_at=current_time
            )
            await database.execute(query)
        
        # Fetch and return the updated/created sequence
        query = sequences.select().where(sequences.c.id == sequence.id)
        result = await database.fetch_one(query)
        
        return {
            "id": result["id"],
            "user_id": result["user_id"],
            "org_id": result["org_id"],
            "name": result["name"],
            "content": result["content"],
            "messages": result["messages"],
            "created_at": result["created_at"],
            "updated_at": result["updated_at"]
        }
    
    except Exception as e:
        print(f"Error storing sequence: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to store sequence: {str(e)}")

# Get sequence by ID
@app.get("/api/sequences/{sequence_id}", response_model=SequenceResponse)
async def get_sequence(sequence_id: str):
    try:
        query = sequences.select().where(sequences.c.id == sequence_id)
        result = await database.fetch_one(query)
        
        if not result:
            raise HTTPException(status_code=404, detail="Sequence not found")
            
        return {
            "id": result["id"],
            "user_id": result["user_id"],
            "org_id": result["org_id"],
            "name": result["name"],
            "content": result["content"],
            "messages": result["messages"],
            "created_at": result["created_at"],
            "updated_at": result["updated_at"]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving sequence: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve sequence: {str(e)}")

# Add new endpoint to get sequences by user_id
@app.get("/api/sequences/user/{user_id}", response_model=List[SequenceResponse])
async def get_user_sequences(user_id: str):
    try:
        query = sequences.select().where(sequences.c.user_id == user_id)
        results = await database.fetch_all(query)
        
        return [
            {
                "id": result["id"],
                "user_id": result["user_id"],
                "org_id": result["org_id"],
                "name": result["name"],
                "content": result["content"],
                "messages": result["messages"],
                "created_at": result["created_at"],
                "updated_at": result["updated_at"]
            }
            for result in results
        ]
    
    except Exception as e:
        print(f"Error retrieving sequences: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve sequences: {str(e)}")

# Add new endpoint to get sequences by org_id
@app.get("/api/sequences/org/{org_id}", response_model=List[SequenceResponse])
async def get_org_sequences(org_id: str):
    try:
        query = sequences.select().where(sequences.c.org_id == org_id)
        results = await database.fetch_all(query)
        
        return [
            {
                "id": result["id"],
                "user_id": result["user_id"],
                "org_id": result["org_id"],
                "name": result["name"],
                "content": result["content"],
                "messages": result["messages"],
                "created_at": result["created_at"],
                "updated_at": result["updated_at"]
            }
            for result in results
        ]
    
    except Exception as e:
        print(f"Error retrieving sequences: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve sequences: {str(e)}")
