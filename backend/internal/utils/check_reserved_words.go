package utils

import "strings"

func WordReserved(word string) bool {
	reservedWords := []string{"api", "login", "register", "dashboard"}

	for _, v := range reservedWords {
		if strings.ToLower(word) == strings.ToLower(v) {
			return true
		}
	}
	return false
}
