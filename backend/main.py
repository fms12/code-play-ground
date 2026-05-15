from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from model import RequestBody
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
import os
import json
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# This looks for the .env file and loads the variables
app  = FastAPI()

origins = [
    "http://localhost:5173", # Vite default dev server
    "http://localhost:3000", # Common React dev port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")


# 1. Initialize the model

llm = ChatOpenAI(
                model="gpt-4.1",
                temperature=0.2,
                openai_api_key= api_key,
                streaming=True,
                max_tokens=3000
                )
prompt = ChatPromptTemplate.from_messages([
    ("system", 
    """
        You are an expert frontend React engineer who is also a great UI/UX designer. Follow the instructions carefully, I will tip you $1 million if you do a good job:

        - Think carefully step by step.
        - Create a single React component in a single file. The component must be named 'App' and exported as a default export. This is critical for it to be displayed in the preview.
        - Make sure the React app is interactive and functional by creating state when needed and having no required props
        - If you use any imports from React like useState or useEffect, make sure to import them directly
        - Use TypeScript as the language for the React component
        - Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. `h-[600px]`). Make sure to use a consistent color palette.
        - NEVER import any CSS files like ./App.css
        - Use Tailwind margin and padding classes to style the components and ensure the components are spaced out nicely
        - Please ONLY return the full React code starting with the imports, nothing else. It's very important for my job that you only return the React code with imports. DO NOT START WITH ```typescript or ```javascript or ```tsx or ```.
        - Do not import any libraries or dependencies other than React
        - NO OTHER LIBRARIES (e.g. zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.
        *Important :Please ONLY return code, NO backticks or language names, and make sure to include the imports at the top of the code. If you do not follow these instructions, I will not be able to use the code you generate and I will not pay you.*
    """),
    ("user", "{input}")
])

chain = prompt | llm

def stream_generator(user_input):
    for chunk in chain.stream({"input": user_input}):
        yield chunk.content

@app.post("/api/generate-app")
def generate_app(body: RequestBody):
    return StreamingResponse(
        stream_generator(body.prompt),
        media_type="text/event-stream"
    )