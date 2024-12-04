import { mat4 } from "gl-matrix";

export function mat4_inverse(a: mat4, b: mat4) {
	b || (b = a);
	var c = a[0], d = a[1], e = a[2], g = a[3], f = a[4], h = a[5], i = a[6], j = a[7], k = a[8], l = a[9], o = a[10], m = a[11], n = a[12], p = a[13], r = a[14], s = a[15], A = c
			* h - d * f, B = c * i - e * f, t = c * j - g * f, u = d * i - e
			* h, v = d * j - g * h, w = e * j - g * i, x = k * p - l * n, y = k
			* r - o * n, z = k * s - m * n, C = l * r - o * p, D = l * s - m
			* p, E = o * s - m * r, q = 1 / (A * E - B * D + t * C + u * z - v
			* y + w * x);
	b[0] = (h * E - i * D + j * C) * q;
	b[1] = (-d * E + e * D - g * C) * q;
	b[2] = (p * w - r * v + s * u) * q;
	b[3] = (-l * w + o * v - m * u) * q;
	b[4] = (-f * E + i * z - j * y) * q;
	b[5] = (c * E - e * z + g * y) * q;
	b[6] = (-n * w + r * t - s * B) * q;
	b[7] = (k * w - o * t + m * B) * q;
	b[8] = (f * D - h * z + j * x) * q;
	b[9] = (-c * D + d * z - g * x) * q;
	b[10] = (n * v - p * t + s * A) * q;
	b[11] = (-k * v + l * t - m * A) * q;
	b[12] = (-f * C + h * y - i * x) * q;
	b[13] = (c * C - d * y + e * x) * q;
	b[14] = (-n * u + p * B - r * A) * q;
	b[15] = (k * u - l * B + o * A) * q;
	return b
};