class Circle {
    constructor() {
        this.circle = document.querySelector('circle');
        this.radius = this.circle.r.baseVal.value;
        this.circumference = this.radius * 2 * Math.PI;
    }

    setProgress(percent) {
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = `${this.circumference}`;
        const offset = -(this.circumference - (percent / 100) * this.circumference);
        this.circle.style.strokeDashoffset = offset;
    }
}