function scoreLetter(score) {
    if (score > 85) {
        return 'A'
    } else if (score > 70 && score <= 85) {
        return 'B'
    } else if (score > 55 && score <= 70) {
        return 'C'
    } else if (score <= 55 && score !== null) {
        return 'E'
    } else if (score === null) {
        return 'empty'
    }
}

module.exports = scoreLetter