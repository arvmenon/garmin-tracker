import pathlib
import unittest


class TestDockerComposeFrontendStorage(unittest.TestCase):
    def setUp(self):
        self.compose_path = pathlib.Path(__file__).resolve().parents[1] / "docker-compose.yml"
        self.compose_text = self.compose_path.read_text(encoding="utf-8")

    def test_frontend_build_volume_is_named(self):
        self.assertIn("frontend_build:", self.compose_text)
        self.assertIn("name: garmin_tracker_frontend_build", self.compose_text)

    def test_frontend_mounts_build_volume(self):
        self.assertIn("- frontend_build:/app/.next", self.compose_text)


if __name__ == "__main__":
    unittest.main()
