from pathlib import Path


DOC_FILES = [
    Path("ARCHITECTURE_PROPOSAL.md"),
    Path("REQUIREMENTS.md"),
    Path("README.md"),
]


def test_docs_reference_frontend_api_base_url_configuration() -> None:
    missing = []
    for doc in DOC_FILES:
        content = doc.read_text(encoding="utf-8")
        if "NEXT_PUBLIC_API_BASE_URL" not in content:
            missing.append(doc)

    assert not missing, f"Missing API base URL config reference in: {missing}"


def test_docs_reference_docker_host_routing_hint() -> None:
    content = Path("ARCHITECTURE_PROPOSAL.md").read_text(encoding="utf-8")
    assert "host.docker.internal" in content
