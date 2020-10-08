import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ApiClientService,
  API_URI_CANDIDATS,
  API_URI_TECHNO,
} from "src/app/api-client/api-client.service";
import { forEach } from "@angular/router/src/utils/collection";

@Component({
  selector: "app-rapport-detaille",
  templateUrl: "./rapport-detaille.component.html",
  styleUrls: ["./rapport-detaille.component.scss"],
})
export class RapportDetailleComponent implements OnInit {
  public idCandidat;
  public candidat: any = null;
  public rapport;
  public rapportTechno = [];
  public uniquetechno;
  public techno = [];
  public totalTime = 0;
  public scorePercent: any = 0;
  public totalPointsCandidat: any = 0;
  public totalPointsCampaign: any = 0;

  constructor(
    route: ActivatedRoute,
    public apiClientService: ApiClientService
  ) {
    this.idCandidat = route.snapshot.params.idCandidat;
  }

  ngOnInit() {
    this.getCandidat();
  }

  removeDuplicates(rapportTechno) {
    const unique = {};
    rapportTechno.forEach((i) => {
      if (!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }

  getCandidat() {
    this.apiClientService
      .get(API_URI_CANDIDATS + "/" + this.idCandidat)
      .subscribe((data) => {

        this.candidat = data;

        if (!data.points_candidat) {
          return;
        }

        const percentArray = data.points_candidat[2]["getpourcentByCandidat"].map((a) => a.percentage);

        const sumPercent = percentArray.reduce((a, b) => parseFloat(a + b));

        this.scorePercent = (sumPercent / percentArray.length).toFixed(2);

        const pointsCampaignArray = data.points_candidat[0][
          "allPointsTechnos"
        ].map((a) => a.points);

        this.totalPointsCampaign = pointsCampaignArray.reduce((a, b) =>
          parseFloat(a + b)
        );
        const pointsCandidatArray = data.points_candidat[1][
          "allPointsCandidat"
        ].map((a) => a.points);

        this.totalPointsCandidat = pointsCandidatArray.reduce((a, b) =>
          parseFloat(a + b)
        );

        this.rapport = data.raport_candidat.rapport;

        this.rapport.forEach(question => {
          // Format datas
          question.index_question.content = question.index_question.content.length === 0 ? [] : question.index_question.content.split("&#x263C;");
          question.index_question.answer_value = question.index_question.answer_value.split("&#x263C;");
          // Extract data
          this.rapportTechno.push(question.index_question.technologies);
          this.totalTime = this.totalTime + question.index_question.time;
          // Compute if candidat answered well
          const candidatAnswers = question.array_rep_candidat.map(val => val.toLowerCase());
          const rightAnswers = question.index_question.answer_value.map(val => val.toLowerCase());
          const questionAnswers = question.index_question.content;
          // TODO #1 : this should be compute server side to avoid duplicate computing when PDF is generated ( source of potentials erros and duplicate maintenance ) WIP SL
          question.is_right_answer = candidatAnswers.every((val) => rightAnswers.includes(val.toLowerCase())) && (questionAnswers.length === 0 ? true : candidatAnswers.length === rightAnswers.length);
        });

        this.uniquetechno = this.removeDuplicates(this.rapportTechno);
        this.uniquetechno.forEach((idTechno) => {
          this.getTechno(idTechno);
        });
      });
  }

  getTechno(id) {
    this.apiClientService.get(API_URI_TECHNO + "/" + id).subscribe((data) => {
      this.techno.push(data);
    });
  }

  fmtMSS(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    return (
      ("0" + h).slice(-2) +
      ":" +
      ("0" + m).slice(-2) +
      ":" +
      ("0" + s).slice(-2)
    );
  }
}
