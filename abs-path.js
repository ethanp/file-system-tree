class AbsPath {
    constructor(absolutePath) {
        this.value = absolutePath
    }

    append(pathPiece) {
        this.value += `/${pathPiece}`
    }

    parent() {
        return this.value.substring(0, this.value.lastIndexOf("/"))
    }

    basename() {
        return this.value.substring(this.value.lastIndexOf("/") + 1, this.value.length)
    }
}
