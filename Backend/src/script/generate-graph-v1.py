"""
Copyright 2024 JasmineGraph Team
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

from pyvis.network import Network

def generate_graph():
    net = Network()
    net.add_node(1, label="Node 1")
    net.add_node(2, label="Node 2")
    net.add_node(3, label="Node 3")
    net.add_edge(1, 2)
    net.add_edge(2, 3)
    net.add_edge(3, 1)

    # Read graph data from a file
    with open('./src/script/sample/sample.dl', 'r') as file:
        lines = file.readlines()
        print("Lines: ", lines)
        for line in lines:
            node1, node2 = map(int, line.split())
            net.add_node(node1, label=f"Node {node1}")
            net.add_node(node2, label=f"Node {node2}")
            net.add_edge(node1, node2)


    # Customize the appearance of the nodes and edges (optional)
    net.set_options("""
    var options = {
      "nodes": {
        "color": {
          "border": "rgba(0,0,0,0.5)",
          "background": "rgba(0,255,0,0.5)",
          "highlight": {
            "border": "rgba(0,0,0,1)",
            "background": "rgba(0,255,0,1)"
          }
        }
      },
      "edges": {
        "color": {
          "color": "rgba(255,0,0,0.5)",
          "highlight": "rgba(255,0,0,1)",
          "hover": "rgba(255,0,0,0.8)"
        }
      }
    }
    """)

    net.save_graph('./src/controllers/graph.html')

if __name__ == "__main__":
    generate_graph()
