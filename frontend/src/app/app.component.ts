import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { of, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface Recommendations {
  position: number;
  bookAuthor: string;
  bookTitle: string;
  publishedDate: string;
  imgSrc: string;
  justification: string;
}
// https://www.infragistics.com/products/ignite-ui-angular/angular/components/rating
// https://www.infragistics.com/products/ignite-ui-web-components/web-components/components/inputs/rating#styling
const ELEMENT_DATA = [
  [
    ['Brandon Sanderson'],
    'The Way of Kings',
    '2014-03-04',
    'http://books.google.com/books/content?id=QVn-CgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  ],
  [
    ['Brandon Sanderson'],
    'Mistborn',
    '2010-04-01',
    'http://books.google.com/books/content?id=t_ZYYXZq4RgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  ],
  [
    ['Patrick Rothfuss'],
    'The Name of the Wind',
    '2007-03-27',
    'http://books.google.com/books/content?id=OlmJEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  ],
  [
    ['Robin Hobb', 'Jody Houser'],
    "Assassin's Apprentice I #1",
    '2022-12-14',
    'http://books.google.com/books/content?id=qMmREAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  ],
  [
    ['N. K. Jemisin'],
    'The Fifth Season',
    '2015-08-04',
    'http://books.google.com/books/content?id=J0tIAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  ],
  [
    ['Robert Jordan'],
    'The Eye of the World',
    '2000-09-15',
    'http://books.google.com/books/content?id=1PgKPuFIz1kC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  ],
  [
    ['Brent Weeks'],
    'The Black Prism',
    '2010-08-25',
    'http://books.google.com/books/content?id=1QAHs3JSVnEC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  ],
  [
    ['Joe Abercrombie'],
    'The Blade Itself',
    '2015-09-08',
    'http://books.google.com/books/content?id=SlizBgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  ],
  [
    ['V. E. Schwab'],
    'A Darker Shade of Magic',
    '2015-02-24',
    'http://books.google.com/books/content?id=wod-BAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  ],
  [
    ['Tamsyn Muir'],
    'Gideon the Ninth',
    '2019-09-10',
    'http://books.google.com/books/content?id=HHJwDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  ],
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AppComponent {
  title = 'book-recommendation-system';

  form: FormGroup;

  url: string = '';

  dataSource: MatTableDataSource<Recommendations>;
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  columnsToDisplay = ['imgSrc', 'bookAuthor', 'bookTitle', 'publishedDate'];
  regColNames = ['Thumbnail', 'Book Author', 'Book Title', 'Published Date'];
  expandedElement: Recommendations | null = null;
  subs: Subscription | null = null;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      bookTitle: ['', Validators.required],
      bookAuthor: ['', Validators.required],
      rating: [3],
      review: ['', Validators.required],
    });
  }

  getValue(e: any) {
    return e && e.justification && e.justification.length > 0;
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.getRawValue());
      this.isLoading = true;

      setTimeout(() => {
        of(ELEMENT_DATA).subscribe((resp) => {
          this.dataSource = new MatTableDataSource(
            ELEMENT_DATA.map(
              (item, index) =>
                ({
                  position: index + 1, // Assuming position is based on index
                  bookAuthor: item[0][0], // Accessing the first element of the nested array
                  bookTitle: item[1],
                  publishedDate: item[2],
                  imgSrc: item[3],
                  justification:
                    index % 2 == 0 ? 'This book is awesome!' : '', // Optional field, can be empty or added if available
                } as Recommendations)
            )
          );
          if (this.dataSource) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

          console.log(this.dataSource);

          this.isLoading = false;
        });
      }, 2000);

      // this.subs = this.http.post(this.url, this.form.getRawValue()).subscribe(
      //   (resp) => {},
      //   (error) => {}
      // );
    }
  }

  ngOnChanges(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  ratingChanged(e: any) {
    console.log(e);
  }
}
