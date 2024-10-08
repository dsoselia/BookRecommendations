from fastapi import FastAPI
from pydantic import BaseModel
import json
import google.generativeai as genai
from googleapiclient.discovery import build
import typing_extensions as typing
import os

GENAI_API_KEY = os.getenv("GENAI_API_KEY")
BOOKS_API_KEY = os.getenv("BOOKS_API_KEY")

genai.configure(api_key=GENAI_API_KEY)


class BookEvaluation(typing.TypedDict):
    book_title: str
    book_author: str
    explanation: str


class RecommendationRequest(BaseModel):
    book_title: str
    book_author: str
    rating: int
    review: str


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app = FastAPI()

prompt = """This is my review for {book_title} by {book_author}. I rated it {rating}/5 stars. Here is my review: 
===
{review}
===
Based on this suggest 10 books I might enjoy and give explanations for each.
"""


def query_model(book_title: str, book_author: str, rating: int, review: str):
    filled_prompt = prompt.format(
        book_title=book_title, book_author=book_author, rating=rating, review=review
    )
    model = genai.GenerativeModel(model_name="models/gemini-1.5-pro")
    result = model.generate_content(
        filled_prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json", response_schema=list[BookEvaluation]
        ),
    )
    return json.loads(result.text)


def get_book_info(title):
    books_service = build("books", "v1", developerKey=BOOKS_API_KEY)
    results = books_service.volumes().list(q=title).execute()
    book_info = results["items"][0]["volumeInfo"]
    authors, title, published_date, thumbnail = (
        book_info["authors"],
        book_info["title"],
        book_info["publishedDate"],
        book_info["imageLinks"]["thumbnail"],
    )
    return {
        "authors": authors,
        "title": title,
        "published_date": published_date,
        "thumbnail": thumbnail,
    }

'''
@app.post("/get_recommendations")
def get_recommendations(request: RecommendationRequest):
    print(request)
    return "book"
'''

@app.post("/get_recommendations")
def get_recommendations(request: RecommendationRequest):
    suggested_books_by_model = query_model(
        request.book_title, request.book_author, request.rating, request.review
    )
    suggested_books = []
    for book in suggested_books_by_model:
        try:
            suggested_books.append(
                get_book_info(book["book_title"] + " " + book["book_author"])
            )
        except:
            print(
                f"Could not find book info for {book['book_title']} by {book['book_author']}"
            )

    # result = {
    #     "queried_book": get_book_info(request.book_title + " " + request.book_author),
    #     "suggested_books": suggested_books,
    # }
    
#       [
#     ['Patrick Rothfuss'],
#     'The Name of the Wind',
#     '2007-03-27',
#     'http://books.google.com/books/content?id=OlmJEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
#   ],
    suggested_books_modified = []
    for suggested_book in suggested_books:
        suggested_books_modified.append([suggested_book["authors"], suggested_book["title"], suggested_book["published_date"], suggested_book["thumbnail"]])
    return suggested_books_modified


# Run the app using: uvicorn main:app --reload
