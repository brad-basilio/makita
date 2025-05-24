<?php
namespace App\Helpers;

class Text
{
    public static function replaceData($content, $data)
    {
        // Procesar bloques repetibles primero
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $content = self::processBlock($content, $key, $value);
            }
        }

        // Reemplazar variables simples
        foreach ($data as $key => $value) {
            if (!is_array($value)) {
                $content = str_replace("{{{$key}}}", htmlspecialchars($value), $content);
            }
        }

        return $content;
    }

    protected static function processBlock($content, $blockName, $items)
    {
        $pattern = '/{{#'.$blockName.'}}(.*?){{\/'.$blockName.'}}/s';
        preg_match($pattern, $content, $matches);
        
        if (!$matches) return $content;

        $blockContent = '';
        $template = $matches[1];

        foreach ($items as $item) {
            $processed = $template;
            foreach ($item as $key => $value) {
                $processed = str_replace(
                    "{{{$key}}}", 
                    htmlspecialchars($value), 
                    $processed
                );
            }
            $blockContent .= $processed;
        }

        return str_replace($matches[0], $blockContent, $content);
    }
}