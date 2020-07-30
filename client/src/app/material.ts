import {
    MatButtonModule, MatFormFieldModule,MatBadgeModule, MatSelectModule, MatInputModule, MatRadioModule, MatCheckboxModule,
    MatIconModule, MatToolbarModule, MatMenuModule, MatListModule, MatSidenavModule, MatDialogModule,
    MatBottomSheetModule, MatTableModule, MatSortModule, MatTooltipModule, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
    MatDialogRef, MatCardModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule,MatGridListModule,MatGridTile, MatSlideToggleModule} from '@angular/material';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { NgModule } from '@angular/core';

@NgModule({
    imports: [MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatRadioModule,
        MatCheckboxModule, MatIconModule, MatToolbarModule, MatMenuModule, MatListModule, MatSidenavModule,
        MatDialogModule, DragDropModule, MatBottomSheetModule, MatTableModule, MatSortModule, MatTooltipModule,
        MatCardModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule,MatGridListModule, MatSlideToggleModule, MatBadgeModule],
    exports: [MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatRadioModule, MatCheckboxModule,
        MatIconModule, MatToolbarModule, MatMenuModule, MatListModule, MatSidenavModule, DragDropModule,
        MatBottomSheetModule, MatTableModule, MatSortModule, MatTooltipModule, MatDialogModule,
        MatCardModule, MatProgressSpinnerModule, MatSnackBarModule, MatExpansionModule,MatGridListModule,MatGridTile, MatSlideToggleModule, MatBadgeModule],
    providers: [
        { provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
        { provide: MatDialogRef, useValue: {} },
    ],
})

export class MaterialModule {
}
