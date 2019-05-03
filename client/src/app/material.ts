import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

import { NgModule } from '@angular/core';


@NgModule({
    imports: [MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatIconModule, MatToolbarModule, MatMenuModule, MatListModule, MatSidenavModule, MatDialogModule, DragDropModule, MatBottomSheetModule],
    exports: [MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatIconModule, MatToolbarModule, MatMenuModule, MatListModule, MatSidenavModule, DragDropModule, MatBottomSheetModule],
})
export class MaterialModule { }