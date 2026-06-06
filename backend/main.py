from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any

app = FastAPI(
    title="VectorShift Pipeline Parsing Backend",
    description="Microservice for topological graph validation, node analytics, and DAG parsing.",
    version="1.0.0"
)

# Configure CORS to allow secure cross-origin communication with frontend hosts
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str = Field(..., description="Unique identifier for the node")
    type: str = Field(..., description="The template component type of the node")
    data: Dict[str, Any] = Field(default_factory=dict, description="Metadata and interactive values loaded in node")

class Edge(BaseModel):
    id: str = Field(..., description="Unique connection string ID")
    source: str = Field(..., description="Origin node identifier")
    target: str = Field(..., description="Destination node identifier")
    sourceHandle: str = Field(None, description="The output connector pin identifier")
    targetHandle: str = Field(None, description="The input connector pin identifier")

class PipelineRequest(BaseModel):
    nodes: List[Node] = Field(..., description="Array of visual node structures from canvas")
    edges: List[Edge] = Field(..., description="Array of connector elements representing data flows")

class ParseResponse(BaseModel):
    num_nodes: int = Field(..., description="Total quantity of nodes active in pipeline")
    num_edges: int = Field(..., description="Total quantity of flow connections registered")
    is_dag: bool = Field(..., description="True if graph does not contain circular logic (Directed Acyclic Graph)")

@app.get("/")
def health_check():
    """Simple health state endpoint ensuring the microservice is operational."""
    return {"status": "operational", "framework": "FastAPI", "version": "1.0.0"}

@app.post("/pipelines/parse", response_model=ParseResponse, status_code=status.HTTP_200_OK)
def parse_pipeline(payload: PipelineRequest):
    """
    Parses structural pipeline flows containing nodes and connection edges.
    Deploys a robust Kahn's Algorithm / Topological Sorting state engine to isolate potential feedback loops,
    verifying if the structural canvas conforms to Directed Acyclic Graph (DAG) requirements.
    """
    try:
        nodes = payload.nodes
        edges = payload.edges

        num_nodes = len(nodes)
        num_edges = len(edges)

        # 1. Map topology structure
        adj_list: Dict[str, List[str]] = {node.id: [] for node in nodes}
        in_degree: Dict[str, int] = {node.id: 0 for node in nodes}

        # Handle implicit nodes that are in edges but not formally declared in nodes list
        for edge in edges:
            u, v = edge.source, edge.target
            if u not in adj_list:
                adj_list[u] = []
                in_degree[u] = 0
            if v not in adj_list:
                adj_list[v] = []
                in_degree[v] = 0
            
            adj_list[u].append(v)
            in_degree[v] += 1

        # 2. Dequeue nodes with in-degree of 0 (no dependencies)
        queue = [node_id for node_id, deg in in_degree.items() if deg == 0]
        visited_count = 0

        # 3. Process dependency queue to verify Acyclic structural state
        while queue:
            curr = queue.pop(0)
            visited_count += 1

            for neighbor in adj_list.get(curr, []):
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        # A valid DAG must visit all declared graph nodes during Kahn's reduction algorithm
        total_unique_nodes = len(in_degree)
        is_dag = (visited_count == total_unique_nodes) if total_unique_nodes > 0 else True

        return ParseResponse(
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=is_dag
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while evaluating the graph topology: {str(e)}"
        )
