import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";

export default function Sidebar() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState("Overview");

  const handleToggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const renderItems = (items: string[]) => {
    return items.map((item) => (
      <ListItemButton
        key={item}
        sx={{ pl: 4 }}
        selected={selectedItem === item}
        onClick={() => setSelectedItem(item)}
      >
        <ListItemText primary={item} />
      </ListItemButton>
    ));
  };

  return (
    <List sx={{ width: 250 }}>
      <ListItemButton onClick={() => handleToggle("Color")}>
        <ListItemText primary="Color" />
        {openSection === "Color" ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openSection === "Color"} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {renderItems([
            "Overview",
            "Semantic Color",
            "System Palette",
            "Color Palette",
            "Styling Hooks",
          ])}
        </List>
      </Collapse>

      <ListItemButton onClick={() => handleToggle("Typography")}>
        <ListItemText primary="Typography" />
        {openSection === "Typography" ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openSection === "Typography"} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {renderItems([
            "Font Family",
            "Font Size",
            "Font Weight",
            "Line Height",
            "Letter Spacing",
          ])}
        </List>
      </Collapse>

      <ListItemButton>
        <ListItemText primary="Spacing and Sizing" />
      </ListItemButton>

      <ListItemButton>
        <ListItemText primary="Display Density" />
      </ListItemButton>

      <ListItemButton>
        <ListItemText primary="Borders and Radius" />
      </ListItemButton>
    </List>
  );
}
