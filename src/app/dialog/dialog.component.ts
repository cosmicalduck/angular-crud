import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {

  freshnessList: string[] = [
    "Pure fresh",
    "Medium freshness",
    "Ripe"
  ];

  productForm !: FormGroup;

  actionBtn: string = "Save";
  formName: string = "Add product form";

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
  ) { }

  ngOnInit(): void {

    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required]
    })

    if (this.editData) {
      this.actionBtn = "Update"
      this.formName = "Update product form"
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  handleFormClick() {
    if (!this.editData) {
      this.addProduct();
    }
    else {
      this.updateProduct()
    }
  }

  updateProduct() {
    if (this.productForm.valid) {
      this.api.putProduct(this.productForm.value, this.editData.id)
        .subscribe({
          next: (res) => {
            alert("Product updated successfully! ٩(ˊᗜˋ*)و");
            this.productForm.reset();
            this.dialogRef.close('update');

          },
          error: () => {
            alert("Product couldn't be updated. Please try again");
          }
        })
    }
  }

  addProduct() {
    if (this.productForm.valid) {
      this.api.postProduct(this.productForm.value)
        .subscribe({
          next: (res) => {
            alert("Product added successfully!");
            this.productForm.reset();
            this.dialogRef.close('save');

          },
          error: () => {
            alert("The product couldn't be added. Please try again");
          }
        })
    }
  }
}
