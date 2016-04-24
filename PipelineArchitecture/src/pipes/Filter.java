package pipes;
import java.util.Observer;

abstract class Filter<T> implements Observer {
	protected Pipe<T> in, out;
	
	public Filter(Pipe<T> in, Pipe<T> out) {
		this.in = in;
		this.out = out;
		if (Pipe.isDataDriven && null != in) {
			in.addObserver(this);
		} 
		else if (null != out){
			out.addObserver(this);
		}
	}
	
	public void setIn(Pipe<T> p) {
		in = p;
		if (null != in && Pipe.isDataDriven) {
			in.addObserver(this);
		}
	}
	
	public void setOut(Pipe<T> p) {
		out = p;
		if (null != out && !Pipe.isDataDriven) {
			out.addObserver(this);
		}		
	}

}