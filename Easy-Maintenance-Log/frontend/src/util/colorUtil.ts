/**
 * Darkens a given color string.
 * 
 * @param color The color to darken in the form of "rgb(r,g,b)", "rgba(r,g,b), or "#rrggbb"
 * @param amount The amount to darken. Default 50.
 */
export default function darken(color: string, amount: number = 50): string {
    if (color.charAt(0) === '#') {
        const r: number = Math.max(0, parseInt(color.substring(1, 3), 16) - amount);
        const g: number = Math.max(0, parseInt(color.substring(3, 5), 16) - amount);
        const b: number = Math.max(0, parseInt(color.substring(5), 16) - amount);
        const rString: string = r.toString(16).toUpperCase().padStart(2, "0");
        const gString: string = g.toString(16).toUpperCase().padStart(2, "0");
        const bString: string = b.toString(16).toUpperCase().padStart(2, "0");
        return "#" + rString + gString + bString;
    }
    if (color.charAt(3) === '(') {
        const numsStr = color.substring(4, color.length-1);
        const numsSplit = numsStr.split(',');
        const r: number = Math.max(0, parseInt(numsSplit[0].trim()) - amount);
        const g: number = Math.max(0, parseInt(numsSplit[1].trim()) - amount);
        const b: number = Math.max(0, parseInt(numsSplit[2].trim()) - amount);
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
    if (color.charAt(3) === 'a') {
        const numsStr = color.substring(5, color.length-1);
        const numsSplit = numsStr.split(',');
        const r: number = Math.max(0, parseInt(numsSplit[0].trim()) - amount);
        const g: number = Math.max(0, parseInt(numsSplit[1].trim()) - amount);
        const b: number = Math.max(0, parseInt(numsSplit[2].trim()) - amount);
        const a: string = numsSplit[3].trim();
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    }

    return "colorUtil darken parse error. For the color please input a #, rgb, or rgba."
}