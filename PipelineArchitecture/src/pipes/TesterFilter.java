package pipes;
import java.util.Observable;
import java.util.function.Predicate;

public class TesterFilter<T> extends Filter<T> {

	private Predicate<T> test;
	private String name;

	public TesterFilter(String name, Pipe<T> in, Pipe<T> out, Predicate<T> test) {
		super(in, out);
		this.test = test;
		this.name = name;
	}
	
	@Override
	public void update(Observable o, Object arg) {
		Message<T> read = null;
		try {
			read = in.read();
		} catch (PipeException e) {
			//read failure
			e.printStackTrace();
			out.write(new Message<T>(null, true, false));
			return;
		}
		
		if (read.getFail() || read.getQuit()) { //bypass quit or fail msg
			out.write(read);
			return;
		}
		
		Boolean testResult = false;
		
		if (null != read.getContent()) {
			testResult = this.test.test(read.getContent()); //use lambda
		}
		
		if (testResult) {//test succeeded
			out.write(read);
		}
		else { // test failed or no content
			out.write(new Message<T>(null, true, false)); //fail msg
		}
	}

	public String toString() {
		return name;
	}
}
