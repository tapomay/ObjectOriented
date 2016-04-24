package garband;

public class MusicNote {

	public static final int SAMPLE_RATE = 16 * 1024; // ~16KHz
	public static final int MAX_AMP = 127;
	public static final int MAX_DUR = 3;

	private String name;
	private Double frequency;
	private Float amplitude;
	private Integer duration;

	public MusicNote() {
		// TODO Auto-generated constructor stub
	}

	public MusicNote(String name, Double frequency, Float amplitude, Integer duration) {
		super();
		this.name = name;
		this.frequency = frequency;
		this.amplitude = amplitude;
		this.duration = duration;
	}

	public byte[] data() {
		byte[] sin = new byte[duration * SAMPLE_RATE];
		if (frequency > 0) {
			for (int i = 0; i < sin.length; i++) {
				double period = (double) SAMPLE_RATE / frequency;
				double angle = 2.0 * Math.PI * i / period;
				sin[i] = (byte) (Math.sin(angle) * amplitude);
			}
		}
		return sin;
	}

	public Double getFrequency() {
		return frequency;
	}

	public void setFrequency(Double frequency) {
		this.frequency = frequency;
	}

	public Float getAmplitude() {
		return amplitude;
	}

	public void setAmplitude(Float amplitude) {
		this.amplitude = amplitude;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	@Override
	public String toString() {
		return "MusicNote [name=" + name + ", frequency=" + frequency + ", amplitude=" + amplitude + ", duration="
				+ duration + "]";
	}

}
