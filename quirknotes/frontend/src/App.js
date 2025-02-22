import React, {useState, useEffect} from "react"
import './App.css';
import Dialog from "./Dialog";
import Note from "./Note";

function App() {

  // -- Backend-related state --
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState(undefined)

  // -- Dialog props-- 
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogNote, setDialogNote] = useState(null)

  
  // -- Database interaction functions --
  useEffect(() => {
    const getNotes = async () => {
      try {
        await fetch("http://localhost:4000/getAllNotes")
        .then(async (response) => {
          if (!response.ok) {
            console.log("Served failed:", response.status)
          } else {
              await response.json().then((data) => {
              getNoteState(data.response)
          }) 
          }
        })
      } catch (error) {
        console.log("Fetch function failed:", error)
      } finally {
        setLoading(false)
      }
    }

    getNotes()
  }, [])

  const deleteNote = async (entry) => {
    // Code for DELETE here
    console.log('Delete Note:' + entry._id)

  try {
      await fetch("http://localhost:4000/deleteNote/"+entry._id,
          {method: "DELETE",
          headers: {
              "Content-Type": "application/json"
          },
         } )
      .then(async (response) => {
          if (!response.ok) {
              setNotes(`Error trying to delete note`)
              console.log("Served failed:", response.status)
              alert("Server failed:" + response.statu)
          } else {
              await response.json().then((data) => {
                  deleteNoteState(entry._id)
              }) 
          }
      })
  } catch (error) {
      setNotes("Error trying to delete note")
      console.log("Fetch function failed:", error)
      alert("Fetch function failed:" + error)

  } 
  }

  const deleteAllNotes = async (entry) => {
    // Code for DELETE all notes here
    console.log("Delete all notes")

    try {
      await fetch("http://localhost:4000/deleteAllNotes/",
          {method: "DELETE",
          headers: {
              "Content-Type": "application/json"
          },
         } )
      .then(async (response) => {
          if (!response.ok) {
              setNotes(`Error trying to delete notes`)
              console.log("Served failed:", response.status)
              alert("Server failed:" + response.status)
          } else {
              await response.json().then((data) => {
                  deleteAllNotesState()
              }) 
          }
      })
  } catch (error) {
      setNotes("Error trying to delete notes")
      console.log("Fetch function failed:", error)
      alert("Fetch function failed:" + error)
  } 
  }

  // -- Dialog functions --
  const editNote = (entry) => {
    setDialogNote(entry)
    setDialogOpen(true)
  }

  const postNote = () => {
    setDialogNote(null)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogNote(null)
    setDialogOpen(false)
  }

  // -- State modification functions -- 
  const getNoteState = (data) => {
    setNotes(data)
  }

  const postNoteState = (_id, title, content) => {
    setNotes((prevNotes) => [...prevNotes, {_id, title, content}])
  }

  const deleteNoteState = (_id) => {
    // // Code for modifying state after DELETE here
     setNotes((prevNotes) => prevNotes.filter((notes) => notes._id !== _id));  
    // const newS = prevNotes.filter(notes => Notes.id !== _id);
    // setNotes(newS);
  }

  const deleteAllNotesState = () => {
    // Code for modifying state after DELETE all here
    setNotes([]);
  }

  const patchNoteState = (_id, title, content) => {
    // Code for modifying state after PATCH here
    setDialogNote(null)
    setDialogOpen(false)

    const i = notes.findIndex(note => note.id === _id);
    if (i !== -1) {
      const updateNotes = [...notes];
      updateNotes[i] = {_id, title, content};
      setNotes(updateNotes);
    } else {
      console.error('Note not found');
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={dialogOpen ? AppStyle.dimBackground : {}}>
          <h1 style={AppStyle.title}>QuirkNotes</h1>
          <h4 style={AppStyle.text}>The best note-taking app ever </h4>

          <div style={AppStyle.notesSection}>
            {loading ?
            <>Loading...</>
            : 
            notes ?
            notes.map((entry) => {
              return (
              <div key={entry._id}>
                <Note
                entry={entry} 
                editNote={editNote} 
                deleteNote={deleteNote}
                />
              </div>
              )
            })
            :
            <div style={AppStyle.notesError}>
              Something has gone horribly wrong!
              We can't get the notes!
            </div>
            }
          </div>

          <button onClick={postNote}>Post Note</button>
          {notes && notes.length > 0 && 
            <button onClick={deleteAllNotes}>
                Delete All Notes
            </button>
          }

        </div>

        <Dialog
          open={dialogOpen}
          initialNote={dialogNote}
          closeDialog={closeDialog}
          postNote={postNoteState}
          patchNote={patchNoteState}
          />

      </header>
    </div>
  );
}

export default App;

const AppStyle = {
  dimBackground: {
    opacity: "20%", 
    pointerEvents: "none"
  },
  notesSection: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: "center"
  },
  notesError: {color: "red"},
  title: {
    margin: "0px"
  }, 
  text: {
    margin: "0px"
  }
}