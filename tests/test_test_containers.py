from pathlib import Path


def test_docker_compose_test_services_are_defined():
    compose_path = Path(__file__).resolve().parents[1] / "docker-compose.test.yml"
    content = compose_path.read_text()

    assert "backend-tests:" in content
    assert "frontend-tests:" in content


def test_test_scripts_exist():
    repo_root = Path(__file__).resolve().parents[1]
    backend_script = repo_root / "docker/testing/backend-test.sh"
    frontend_script = repo_root / "docker/testing/frontend-test.sh"

    assert backend_script.exists()
    assert frontend_script.exists()
