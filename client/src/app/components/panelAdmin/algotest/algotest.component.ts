import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-algotest",
  templateUrl: "./algotest.component.html",
  styleUrls: ["./algotest.component.css"]
})
export class AlgotestComponent implements OnInit {
  public result: any;
  public  filetype:any ="application/java";
  public filename:any = "Main.java";
  public question: any = {
    content: `

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
    }
    `
  };
  public options: any = { theme: "vs-white", language: "java" };

  
  constructor() {}
  
  ngOnInit() {}
}
