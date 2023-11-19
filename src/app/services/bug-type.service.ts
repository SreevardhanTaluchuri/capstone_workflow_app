import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BugTypeService {

  private _bugs = [
    {
      name : "Bug",
      color : "rgba(250,0,0,0.8)"
    },
    {
      name : "Tasks",
      color : "#1EA7FF"
    },
    {
      name : "Story",
      color : "#F59E0B"
    },
    {
      name : "Feature",
      color : "#E97342"
    },
    {
      name : "Milestone",
      color : "#0ACF83"
    },
    {
      name : "Epic",
      color : "#5051F9"
    },
    {
      name : "Rush",
      color : "#5051F9"
    },
    {
      name : "Test case",
      color : "#5051F9"
    },
    {
      name : "Deploy",
      color : "#5051F9"
    },
    {
      name : "Deployment",
      color : "#5051F9"
    },
  ]

  constructor() { }

  getColorFromTypeName(bugType : string) : string | undefined{
    return this._bugs.find(type => type.name == bugType)?.color;
  }
}
