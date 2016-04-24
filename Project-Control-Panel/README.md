# CS251A- Project Control Panel - Blue team

## Problem definition:
### http://cs.sjsu.edu/faculty/pearce/modules/projects/ooa/pm/index.htm

## BUILDING FROM SOURCE:
### Install node.js and npm package manager before starting.
### 1. git clone https://github.com/tapomay/ooa-pcp
### 2. cd ooa-pcp
### 3. npm install
#### If failing: install npm modules bower adn http-server separately.
### 4. npm start


## USING THE APP:
### 1. Create new project: File->New
### 2. Add Resources in Resources tab
### 3. Graph tab:
	#### 3.1: Click on load jobs before creating anything. If you miss that, plz navigate to some other tab and come back.
	#### 3.2: Click on empty space to create a job node. Click on a node to edit or save a job. You may have to click twice.
	#### 3.3: Click on a job and drag an edge to other job to specify predecessor-successor dependency. Note that the job before the other is always considered as predecessor irrespective of direction of dragging. 
### 4. Validations:
	#### 4.1: Shows alert if there are other jobs within the span of time defined by startTime and duration that use atleast on of the required resources.
	#### 4.2: You may save a job without specifying resources.
	#### 4.3: Shows alert if startTime predates endtime of predecessor or endTime is after startTime of any successors.
### 5. Composite jobs:
	#### 5.1: Create child jobs before the composite one. All validations defined in 4 are applicable.
	#### 5.2: Create parent job without specifying resources and correct startTime - duration. 
	#### 5.3: After saving the parent job, click on its node and click on make composite.
	#### 5.4: Add children
	#### 5.5: Set required resources and save
### 6. Gantt chart and Schedule are automatically generated.



### For graph we are using: http://bl.ocks.org/rkirsling/5001347
### For MVC: We are usign Angularjs