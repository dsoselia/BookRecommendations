## FASTAPI app for BookRecommendation

Run using `uvicorn main:app --reload`

### API Endpoints
/get_recommendations - POST
```
{
  "book_title": "The Way of Kings (The Stormlight Archive, #1)",
  "book_author": "Brandon Sanderson",
  "rating": 5,
  "review": "I really liked it"
}
```

Returns

```
{
    "queried_book_info": [
        [
            "Brandon Sanderson"
        ],
        "The Way of Kings",
        "2014-03-04",
        "http://books.google.com/books/content?id=QVn-CgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    ],
    "suggested_books": [
        [
            [
                "Brandon Sanderson"
            ],
            "The Way of Kings",
            "2014-03-04",
            "http://books.google.com/books/content?id=QVn-CgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        ],
        [
            [
                "Brandon Sanderson"
            ],
            "Mistborn",
            "2010-04-01",
            "http://books.google.com/books/content?id=t_ZYYXZq4RgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        ],
    ]
}
```

See documentation at localhost:8000/docs