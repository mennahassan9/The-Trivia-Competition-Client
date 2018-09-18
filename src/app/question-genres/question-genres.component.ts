import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-question-genres',
  templateUrl: './question-genres.component.html',
  styleUrls: ['./question-genres.component.css']
})
export class QuestionGenresComponent implements OnInit {

  @Output()
  questionAdded: EventEmitter<any> = new EventEmitter<any>();


  public genres: any=[];
  modalRef: ModalDirective;
  successfulAlert: boolean;
  failedAlert: boolean;
  enterGenre: boolean;
  formErrorAlert: boolean;
  statistics: any[];
  c: string;
  d: string;

 

  constructor(
    private adminService: AdminService,
    private questionService: QuestionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getGenres();
  }
  getGenres() {
    this.questionService.getQuestionGenres().subscribe((res) => {
      console.log(res.json()['genres'])
      this.genres = res.json()['genres'];
    })
  }
  getQuestionsByGenre(genre) {
    this.router.navigate([`./questions/${genre}`])
  }
  openAddModal(modal: ModalDirective) {
    this.hideAlerts();
    this.modalRef = modal;
    this.modalRef.show();
  }
  close(questionForm: NgForm) {
    questionForm.reset();
    this.modalRef.hide();
    this.enterGenre = false;
    this.hideAlerts();
  }
  addQuestion(questionForm: NgForm) {
    this.hideAlerts();
    if (!questionForm.valid) {
      this.formErrorAlert = true;
    }
    else {
      let newQuestion = questionForm.value;
      newQuestion['genre'] = newQuestion['genre'] != 'other' ? newQuestion['genre'] : newQuestion['other_genre'];
      let correctAnswer = newQuestion['correct_answer'];
      newQuestion['correct_answer'] = newQuestion[correctAnswer];
      this.questionService.addQuestion(newQuestion).subscribe((res) => {
        if (newQuestion.other_genre) {
          this.genres.push(newQuestion['other_genre'])
        }
        this.successfulAlert = true;

        this.adminService.getStats().subscribe((res) => {
      
          this.statistics = res.json()['body'];
          this.questionAdded.emit();
          console.log(this.statistics,"question genre")
        });
        
      }, (err) => {
        this.failedAlert = true;
      });
      this.close(questionForm);
    }
  }
  hideAlerts() {
    this.successfulAlert = false;
    this.failedAlert = false;
    this.formErrorAlert = false;
  }
}
