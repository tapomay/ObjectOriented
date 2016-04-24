Computed design metrics of all classes in a Class diagram given in MDJ format.

How to Run:
Pass filepath as command line arg:
$> node da.js test2.mdj


Algorithm:

associations = Collect all UMLAssociations
generalizations = Collect all UML Generalizations
parameters = Collect all UMLParameters
operations = Collect all UMLOperations //required for parameter to class parent class mapping
classes & interfaces = Collect all UMLClass
buildClassIndex

assocMap:
    emit key = assoc.end2.reference.$ref, value = RESPONSIBILITY
    emit key = assoc.end1.reference.$ref, value = INSTABILITY

genMap:
    emit key = gen.target.$ref, value = RESPONSIBILITY
    emit key = gen.source.$ref, value = INSTABILITY

paramMap:
    emit key = param.type.$ref, value = RESPONSIBILITY
    emit key = operations[param.parent.$ref].parent.$ref, value = INSTABILITY

metrics = [];

commonReducer (key = classRef, value=[RESPONSIBILITY/INSTABILITY])
    resp = count(value[value==RESPONSIBILITY])
    instab = count(value[value==INSTABILITY])
    m = new Metric(classIndex[classRef], resp, instab)
    m.compute()
    metric.add(m)

for each metric:
    m.print

TableView(metrics)


class Metric {
    name:String //class name
    instability = 0
    responsibility = 0
    compute = function() //computes stability and deviance
    print = function() //prints metrics for this class
    getMetrics = function(){return this} // returns metrics as map
}

TableView = function(Metric[]) {
    collect keys from first metric
    Create a formatted table and print on console.
}

