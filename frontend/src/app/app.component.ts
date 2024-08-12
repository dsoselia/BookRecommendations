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
import { Subscription } from 'rxjs';
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

  url: string = 'http://34.229.179.95:8001/get_recommendations/';

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
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  columnsToDisplay = ['imgSrc', 'bookAuthor', 'bookTitle', 'publishedDate'];
  regColNames = ['Thumbnail', 'Book Author', 'Book Title', 'Published Date'];
  expandedElement: Recommendations | null = null;
  subs: Subscription | null = null;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      book_title: ['', Validators.required],
      book_author: ['', Validators.required],
      rating: [3],
      review: ['', Validators.required],
    });
  }

  getValue(e: any) {
    return e && e.justification && e.justification.length > 0;
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.subs = this.http.post(this.url, this.form.getRawValue()).subscribe(
        (resp: any) => {
          this.dataSource = new MatTableDataSource(
            resp.map(
              (item: any, index: any) =>
                ({
                  position: index + 1, // Assuming position is based on index
                  bookAuthor: item[0][0], // Accessing the first element of the nested array
                  bookTitle: item[1],
                  publishedDate: item[2],
                  imgSrc: item[3],
                  justification: item[4], // Optional field, can be empty or added if available
                } as Recommendations)
            )
          );
          if (this.dataSource) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
          this.isLoading = false;
        },
        (error: any) => {
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
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
}
