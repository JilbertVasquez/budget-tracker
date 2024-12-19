import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {
    MatTableDataSource,
    MatTableModule,
} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
    selector: 'app-data-table',
    imports: [
        MatSortModule,
        MatPaginatorModule,
        MatTableModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
    ],
    templateUrl: './data-table.component.html',
    styleUrl: './data-table.component.css',
})
export class DataTableComponent<T> {
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @Output() editData = new EventEmitter<T>();
    @Output() deleteData = new EventEmitter<T>();
    @Input() isLoading = false;
    @Input() columns!: Column[];

    dataSource = new MatTableDataSource<T>();
    displayColumns: string[] = [];

    ngOnInit() {
        this.displayColumns = this.columns.map(x => x.identifier);
    }

    ngOnDestroy() {
        this.dataSource.disconnect();
    }

    ngAfterViewInit() {
        if (this.sort && this.paginator) {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }
    }

    forcedUpdateDataSource() {
        this.dataSource._updateChangeSubscription();
    }

    onEdit(data: T) {
        this.editData.emit(data);
    }

    onDelete(data: T) {
        this.deleteData.emit(data);
    }
}

export type Column = {
    identifier: string;
    title: string;
};
