export interface Issue{
    id? : string,
    title : string,
    project : string,
    points : number,
    status : string,
    assignee : string,
    reporter : string,
    description : string,
    created_by? : string,
    due_date : string,
    type : string,
    priority :string,
}