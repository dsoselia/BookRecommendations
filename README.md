## FASTAPI app for BookRecommendation

Run using `uvicorn main:app --reload`

## Docker
``` bash
docker build . -t bookrecommendation
```
Place keys in .env file. Or pass manually using -e parameter
```bash
docker run --env-file .env -p 8001:8000 -p 80:4200 bookrecommendation
```

This will run server on port 80
API will be avilable on 8001 on host if needed


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