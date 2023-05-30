#define FALLING_SPEED  0.05
#define STRIPES_FACTOR 26.0

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

float round(vec2 x) { return float(int(x+sign(x)*0.5)); }

//main
void mainImage(out vec4 fragColor, in vec2 fragCoord )
{
	//normalize pixel coordinates
	vec2 uv = fragCoord / resolution.xy;
	//pixellize uv
	vec2 clamped_uv = (round(fragCoord / STRIPES_FACTOR) * STRIPES_FACTOR) / resolution.xy;
	//get pseudo-random value for stripe height
	float value	= fract(sin(clamped_uv.x) * 43758.5453123);
	//create stripes
	vec3 col = vec3(1.0 - mod(uv.y * 0.5 + (time * (FALLING_SPEED + value / 5.0)) + value, 0.5));
	//add color
	col *= clamp(cos(time * 2.0 + uv.xyx + vec3(0, 2, 4)), 0.0, 1.0);
	//add screen fade
	col *= vec3(exp(-pow(abs(uv.y - 0.5), 6.0) / pow(2.0 * 0.05, 2.0)));
	// Output to screen
	fragColor = vec4(col,1.0);
}

void main(void)
{
	mainImage(gl_FragColor, fragCoord.xy);
	gl_FragColor.a = 1.0;
}
