import {
    MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatRadioModule, MatCheckboxModule,
    MatIconModule, MatToolbarModule, MatMenuModule, MatListModule, MatSidenavModule, MatDialogModule,
    MatBottomSheetModule, MatTableModule, MatSortModule, MatTooltipModule, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS
} from '@angular/material';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { NgModule } from '@angular/core';

@NgModule({
    imports: [MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatRadioModule,
        MatCheckboxModule, MatIconModule, MatToolbarModule, MatMenuModule, MatListModule, MatSidenavModule,
        MatDialogModule, DragDropModule, MatBottomSheetModule, MatTableModule, MatSortModule, MatTooltipModule],
    exports: [MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatRadioModule, MatCheckboxModule,
        MatIconModule, MatToolbarModule, MatMenuModule, MatListModule, MatSidenavModule, DragDropModule,
        MatBottomSheetModule, MatTableModule, MatSortModule, MatTooltipModule],
    providers: [
        { provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
    ],
})

export class MaterialModule {
}
