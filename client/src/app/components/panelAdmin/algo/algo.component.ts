import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-algo",
  templateUrl: "./algo.component.html",
  styleUrls: ["./algo.component.css"]
})
export class AlgoComponent implements OnInit {
  @Input() question = {};
  editorOptions = { theme: "vs-white", language: "java" };
  code: string = `

  import java.util.HashMap;
  
  public class Main {
    public static void main(String[] args) {
  
      HashMap<String, Integer> map = new HashMap<>();
  
      map.put("Ehfall", 34);
      map.put("Jacky", 34);
      map.put("lili", 34);
      map.put("toto", 35);
      for(Integer i :map.values()){
        System.out.println(i);
      }
  
    }
  }"
  
  `;
  constructor() {}

  ngOnInit() {}
}
