package pipes;
import java.util.Observable;
import java.util.function.Function;

public class TransformerFilter<T> extends Filter<T> {

	private Function<T, T> transform;
	private String name;

	public TransformerFilter(String name, Pipe<T> in, Pipe<T> out, Function<T, T> transform) {
		super(in, out);
		this.transform = transform;
		this.name = name;
	}

	@Override
	public void update(Observable o, Object arg) {
		Message<T> read = null;
		try {
			read = in.read();
		} catch (PipeException e) { // read failed
			e.printStackTrace();
			out.write(new Message<T>(null, true, false));
			return;
		}

		if (read.getFail() || read.getQuit()) { // bypass: quit or fail msg
			out.write(read);
			return;
		}

		Message<T> result = null;

		if (null != read.getContent()) {
			try {
				T resultPayload = this.transform.apply(read.getContent()); //use lambda
				result = new Message<T>(resultPayload, false, false);
			} catch (Exception e) {
				System.err.println(e);
			}
		}

		if (null != result) {// transform succeeded
			out.write(read);
		} else { // transform failed or no content
			out.write(new Message<T>(null, true, false)); // fail msg
		}
	}

	public String toString() {
		return name;
	}
}
