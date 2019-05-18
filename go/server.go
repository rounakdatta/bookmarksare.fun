package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

// King's Landing
func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello Golang!")
}

// Medium bookmarks handler
func mediumHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userName := vars["user"]

	fmt.Fprintf(w, "Request received for user: %s ", userName)
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/", handler)
	r.HandleFunc("/bookmarks/{user}/medium", mediumHandler)

	http.ListenAndServe(":3000", r)
}
