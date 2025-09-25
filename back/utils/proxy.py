import socket
import threading


def handle_client(client_socket, remote_host, remote_port):
    try:
        # Create a socket to connect to the remote server
        remote_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        remote_socket.connect((remote_host, remote_port))

        # Start two threads to shuttle data back and forth
        thread1 = threading.Thread(
            target=forward_data, args=(client_socket, remote_socket)
        )
        thread2 = threading.Thread(
            target=forward_data, args=(remote_socket, client_socket)
        )
        thread1.start()
        thread2.start()

    except Exception as e:
        print(f"Error handling connection: {e}")
        client_socket.close()


def forward_data(source_socket, destination_socket):
    try:
        while True:
            data = source_socket.recv(4096)
            if not data:
                break
            destination_socket.sendall(data)
    except:
        pass
    finally:
        source_socket.close()
        destination_socket.close()


def start_proxy():
    local_host = "127.0.0.1"
    local_port = 8888

    proxy_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    proxy_server.bind((local_host, local_port))
    proxy_server.listen(5)

    print(f"Proxy server listening on {local_host}:{local_port}")

    while True:
        client_socket, addr = proxy_server.accept()
        print(f"Accepted connection from {addr[0]}:{addr[1]}")

        # Determine the target host from the request
        request = client_socket.recv(4096)
        if not request:
            continue

        first_line = request.split(b"\n")[0]
        try:
            url = first_line.split()[1]
            if url.startswith(b"http://"):
                host_port = url.split(b"/")[2].split(b":")
                remote_host = host_port[0].decode("utf-8")
                remote_port = (
                    int(host_port[1].decode("utf-8")) if len(host_port) > 1 else 80
                )
            elif first_line.startswith(b"CONNECT"):
                host_port = first_line.split()[1].split(b":")
                remote_host = host_port[0].decode("utf-8")
                remote_port = (
                    int(host_port[1].decode("utf-8")) if len(host_port) > 1 else 443
                )
                client_socket.sendall(b"HTTP/1.1 200 OK\r\n\r\n")
                # No need to forward the CONNECT line
                request = b""
            else:
                continue

            # Send the request to the remote server
            remote_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            remote_socket.connect((remote_host, remote_port))
            if request:
                remote_socket.sendall(request)

            # Start threads to handle communication
            thread1 = threading.Thread(
                target=forward_data, args=(client_socket, remote_socket)
            )
            thread2 = threading.Thread(
                target=forward_data, args=(remote_socket, client_socket)
            )
            thread1.start()
            thread2.start()

        except Exception as e:
            print(f"Error parsing request: {e}")
            client_socket.close()


if __name__ == "__main__":
    start_proxy()
