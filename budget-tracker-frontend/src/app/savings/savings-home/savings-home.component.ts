import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-savings-home',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './savings-home.component.html',
  styleUrl: './savings-home.component.css'
})
export class SavingsHomeComponent {

}
