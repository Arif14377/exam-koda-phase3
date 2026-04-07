package models

type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Results any    `json:"results"`
}

type Session struct {
	Token string      `json:"token"`
	User  UserSession `json:"user"`
}
