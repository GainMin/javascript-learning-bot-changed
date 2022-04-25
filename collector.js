
const LINKS = {
    lesson_1: {
        lesson: "https://www.youtube.com/watch?v=pn5myCmpV2U&t=2390s",
        gdriveID: "1ebaDPbUijrilCftXioVmtCUfHjAGd0qO"
    },
    lesson_2: {
        lesson: "https://www.youtube.com/watch?v=mkJqzPfQtwM&t=3860s",
        gdriveID: "11NCf8O4GOCrnz-U1B59PiGBtJX-TRIfD"
    },
    lesson_3: {
        lesson: "https://www.youtube.com/watch?v=d44p-yUwaZ8",
        gdriveID: "1mZ3aUQ6vSEjlg6hjMiIX1RbI6DzyPXql"
    },
    lesson_4: {
        lesson: "https://www.youtube.com/watch?v=0iF09cy7OqI",
        gdriveID: "1oGy0Jc_W8lb96rR3AxulvC1M7c6RRzjV"
    }
}

const GDriveLinksTemplates = {
    driveLink: "https://drive.google.com/file/d/{{id}}/view?usp=sharing",
    downloadLink: "https://docs.google.com/uc?export=download&id={{id}}",
}

module.exports = (lessonID) => {
    return {
        driveLink: GDriveLinksTemplates.driveLink.replace("{{id}}", LINKS[lessonID].gdriveID),
        downloadLink: GDriveLinksTemplates.downloadLink.replace("{{id}}", LINKS[lessonID].gdriveID),
        lessonLink: LINKS[lessonID].lesson
    }
};
